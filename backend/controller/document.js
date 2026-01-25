const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const axios = require('axios');
const { documentSchema } = require('../model/schema');
const { recordActivity } = require('../utils/auditLogger');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Document model
const Document = mongoose.model('Document', documentSchema);

// Python microservice URLs
const PYTHON_API_URL = 'http://localhost:8000/process-document';
const PYTHON_DELETE_URL = 'http://localhost:8000/delete-document';

// Upload Document
const uploadDocument = async (req, res) => {
    try {
        const { category } = req.body;
        const userId = (req.user?.id) || null;
        const companyId = (req.user?.company_id) || req.company_id;
        
        if (!req.file) {
            await recordActivity(req, { action: 'DOCUMENT_UPLOAD', resource: '/document/upload', result: 400, metadata: { reason: 'no_file' } });
            return res.status(400).json({ error: 'No file provided' });
        }

        if (!category) {
            await recordActivity(req, { action: 'DOCUMENT_UPLOAD', resource: '/document/upload', result: 400, metadata: { reason: 'missing_category' } });
            return res.status(400).json({ error: 'Category is required' });
        }

        if (!companyId) {
            await recordActivity(req, { action: 'DOCUMENT_UPLOAD', resource: '/document/upload', result: 401, metadata: { reason: 'missing_company' } });
            return res.status(401).json({ error: 'Company ID not provided' });
        }

        // Upload file to Cloudinary from buffer
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'documents',
                public_id: `doc_${Date.now()}`,
                type: 'upload',
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ error: 'File upload failed' });
                }

                try {
                    // Create document record in database
                    const document = new Document({
                        company_id: companyId,
                        name: req.file.originalname,
                        category: category,
                        type: req.file.originalname.split('.').pop().toUpperCase(),
                        size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
                        url: result.secure_url,
                        cloudinaryId: result.public_id,
                        uploaded_by: userId || undefined,
                        status: 'active',
                    });

                    const savedDocument = await document.save();
                    
                    // Process document for Pinecone indexing (async, don't wait)
                    processDocumentForPinecone(
                        result.secure_url,
                        companyId,
                        userId,
                        savedDocument.id,
                        req.file.originalname,
                        category
                    ).catch(err => {
                        console.error('Error processing document for Pinecone:', err);
                    });
                    
                    await recordActivity(req, {
                        action: 'DOCUMENT_UPLOAD',
                        resource: savedDocument.name,
                        result: 201,
                        metadata: { documentId: savedDocument.id, path: '/document/upload', name: savedDocument.name, category }
                    });

                    res.status(201).json({
                        message: 'Document uploaded successfully',
                        document: savedDocument,
                    });
                } catch (dbError) {
                    console.error('Database error:', dbError);
                    await recordActivity(req, { action: 'DOCUMENT_UPLOAD', resource: '/document/upload', result: 500, metadata: { error: dbError.message } });
                    res.status(500).json({ error: 'Failed to save document to database' });
                }
            }
        );

        // Pipe file buffer to upload stream
        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading document:', error);
        await recordActivity(req, { action: 'DOCUMENT_UPLOAD', resource: '/document/upload', result: 500, metadata: { error: error.message } });
        res.status(500).json({ error: 'Internal server error' });
    }
};

// Process document for Pinecone indexing
const processDocumentForPinecone = async (documentUrl, companyId, userId, pdfId, source, category) => {
    try {
        const formData = new URLSearchParams();
        formData.append('companyId', companyId);
        if (userId) formData.append('userId', userId);
        formData.append('pdfId', pdfId);
        formData.append('source', source);
        formData.append('url', documentUrl);
        if (category) formData.append('category', category);

        const response = await axios.post(
            PYTHON_API_URL,
            formData,
            {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                timeout: 120000 // 2 minute timeout for document processing
            }
        );

        console.log('Document processed and indexed in Pinecone:', response.data);
        return response.data;
    } catch (error) {
        console.error('Error calling Python microservice:', error.message);
        throw error;
    }
};

// List Documents
const listDocuments = async (req, res) => {
    try {
        const { category, search } = req.query;
        const companyId = req.user.company_id;

        if (!companyId) {
            return res.status(401).json({ error: 'Company ID not found in token' });
        }

        let query = { status: 'active', company_id: companyId };

        if (category && category !== 'all') {
            query.category = category;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const documents = await Document.find(query).sort({ uploadDate: -1 });

        res.status(200).json({
            message: 'Documents retrieved successfully',
            documents: documents,
            count: documents.length,
        });
    } catch (error) {
        console.error('Error fetching documents:', error);
        res.status(500).json({ error: 'Failed to fetch documents' });
    }
};

// Delete Document
const deleteDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const companyId = req.user.company_id;

        const document = await Document.findById(documentId);
        if (!document) {
            await recordActivity(req, { action: 'DOCUMENT_DELETE', resource: `/document/${documentId}`, result: 404 });
            return res.status(404).json({ error: 'Document not found' });
        }

        // Verify document belongs to user's company
        if (document.company_id !== companyId) {
            await recordActivity(req, { action: 'DOCUMENT_DELETE', resource: `/document/${documentId}`, result: 403 });
            return res.status(403).json({ error: 'Access denied' });
        }

        // Delete from Cloudinary
        if (document.cloudinaryId) {
            await cloudinary.uploader.destroy(document.cloudinaryId, { resource_type: 'raw' });
        }

        // Delete from database
        await Document.findByIdAndDelete(documentId);
        await recordActivity(req, { action: 'DOCUMENT_DELETE', resource: document.name, result: 200, metadata: { documentId, path: `/document/${documentId}`, name: document.name } });

        // Delete vectors from Pinecone via Python service (best-effort)
        try {
            await axios.post(PYTHON_DELETE_URL, {
                pdfId: document._id?.toString?.() || document.id,
                companyId: companyId,
                namespace: undefined
            });
        } catch (err) {
            console.error('Error deleting document vectors:', err?.response?.data || err.message);
        }

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        await recordActivity(req, { action: 'DOCUMENT_DELETE', resource: `/document/${req.params?.documentId}`, result: 500, metadata: { error: error.message } });
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

// Download Document (returns URL with attachment flag)
const downloadDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const companyId = req.user.company_id;

        const document = await Document.findById(documentId);
        if (!document) {
            await recordActivity(req, { action: 'DOCUMENT_DOWNLOAD', resource: `/document/download/${documentId}`, result: 404 });
            return res.status(404).json({ error: 'Document not found' });
        }

        // Verify document belongs to user's company
        if (document.company_id !== companyId) {
            await recordActivity(req, { action: 'DOCUMENT_DOWNLOAD', resource: `/document/download/${documentId}`, result: 403 });
            return res.status(403).json({ error: 'Access denied' });
        }

        // Generate download URL with attachment flag
        const downloadUrl = cloudinary.url(document.cloudinaryId, {
            resource_type: 'raw',
            flags: 'attachment',
            secure: true
        });

        await recordActivity(req, { action: 'DOCUMENT_DOWNLOAD', resource: document.name, result: 200, metadata: { documentId, path: `/document/download/${documentId}`, name: document.name } });

        res.status(200).json({
            message: 'Download URL retrieved',
            downloadUrl: downloadUrl,
            fileName: document.name,
        });
    } catch (error) {
        console.error('Error getting download URL:', error);
        await recordActivity(req, { action: 'DOCUMENT_DOWNLOAD', resource: `/document/download/${req.params?.documentId}`, result: 500, metadata: { error: error.message } });
        res.status(500).json({ error: 'Failed to get download URL' });
    }
};

// View Document (returns URL for inline viewing)
const viewDocument = async (req, res) => {
    try {
        const { documentId } = req.params;
        const companyId = req.user.company_id;

        const document = await Document.findById(documentId);
        if (!document) {
            await recordActivity(req, { action: 'DOCUMENT_VIEW', resource: `/document/view/${documentId}`, result: 404 });
            return res.status(404).json({ error: 'Document not found' });
        }

        // Verify document belongs to user's company
        if (document.company_id !== companyId) {
            await recordActivity(req, { action: 'DOCUMENT_VIEW', resource: `/document/view/${documentId}`, result: 403 });
            return res.status(403).json({ error: 'Access denied' });
        }

        // Generate inline viewing URL without attachment flag
        const viewUrl = cloudinary.url(document.cloudinaryId, {
            resource_type: 'raw',
            secure: true
        });

        await recordActivity(req, { action: 'DOCUMENT_VIEW', resource: document.name, result: 200, metadata: { documentId, path: `/document/view/${documentId}`, name: document.name } });

        res.status(200).json({
            message: 'View URL retrieved',
            viewUrl: viewUrl,
            fileName: document.name,
            fileType: document.type,
        });
    } catch (error) {
        console.error('Error getting view URL:', error);
        await recordActivity(req, { action: 'DOCUMENT_VIEW', resource: `/document/view/${req.params?.documentId}`, result: 500, metadata: { error: error.message } });
        res.status(500).json({ error: 'Failed to get view URL' });
    }
};

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument,
    downloadDocument,
    viewDocument,
};
