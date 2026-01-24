const cloudinary = require('cloudinary').v2;
const mongoose = require('mongoose');
const axios = require('axios');
const { documentSchema } = require('../model/schema');
require('dotenv').config();

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Create Document model
const Document = mongoose.model('Document', documentSchema);

// Python microservice URL
const PYTHON_API_URL = 'http://localhost:8000/process-document';

// Upload Document
const uploadDocument = async (req, res) => {
    try {
        const { category } = req.body;
        const userId = (req.user?.id) || null;
        const companyId = (req.user?.company_id) || req.company_id;
        
        if (!req.file) {
            return res.status(400).json({ error: 'No file provided' });
        }

        if (!category) {
            return res.status(400).json({ error: 'Category is required' });
        }

        if (!companyId) {
            return res.status(401).json({ error: 'Company ID not provided' });
        }

        // Upload file to Cloudinary from buffer
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                resource_type: 'raw',
                folder: 'documents',
                public_id: `${Date.now()}_${req.file.originalname.split('.')[0]}`,
                type: 'upload',
                flags: 'attachment',
            },
            async (error, result) => {
                if (error) {
                    console.error('Cloudinary upload error:', error);
                    return res.status(500).json({ error: 'File upload failed' });
                }

                try {
                    // Create document record in database
                    const document = new Document({
                        name: req.file.originalname,
                        category: category,
                        type: req.file.originalname.split('.').pop().toUpperCase(),
                        size: `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`,
                        url: result.secure_url,
                        cloudinaryId: result.public_id,
                        uploadedBy: req.body.uploadedBy || 'Admin',
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
                    
                    res.status(201).json({
                        message: 'Document uploaded successfully',
                        document: savedDocument,
                    });
                } catch (dbError) {
                    console.error('Database error:', dbError);
                    res.status(500).json({ error: 'Failed to save document to database' });
                }
            }
        );

        // Pipe file buffer to upload stream
        uploadStream.end(req.file.buffer);
    } catch (error) {
        console.error('Error uploading document:', error);
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
        let query = { status: 'active' };

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

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        // Delete from Cloudinary
        if (document.cloudinaryId) {
            await cloudinary.uploader.destroy(document.cloudinaryId);
        }

        // Delete from database
        await Document.findByIdAndDelete(documentId);

        res.status(200).json({ message: 'Document deleted successfully' });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ error: 'Failed to delete document' });
    }
};

// Download Document (returns URL)
const downloadDocument = async (req, res) => {
    try {
        const { documentId } = req.params;

        const document = await Document.findById(documentId);
        if (!document) {
            return res.status(404).json({ error: 'Document not found' });
        }

        res.status(200).json({
            message: 'Download URL retrieved',
            downloadUrl: document.url,
            fileName: document.name,
        });
    } catch (error) {
        console.error('Error getting download URL:', error);
        res.status(500).json({ error: 'Failed to get download URL' });
    }
};

module.exports = {
    uploadDocument,
    listDocuments,
    deleteDocument,
    downloadDocument,
};
