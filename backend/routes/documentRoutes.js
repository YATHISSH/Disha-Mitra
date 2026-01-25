const express = require('express');
const multer = require('multer');
const documentController = require('../controller/document');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Configure multer for memory storage (we'll upload to Cloudinary)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024, // 50MB max file size
    },
    fileFilter: (req, file, cb) => {
        // Allowed file types
        const allowedMimes = [
            'application/pdf',
            'application/msword',
            'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            'application/vnd.ms-powerpoint',
            'application/vnd.openxmlformats-officedocument.presentationml.presentation',
            'text/plain',
            'application/vnd.ms-excel',
            'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type. Only PDF, DOCX, PPTX, TXT, and XLSX files are allowed.'));
        }
    },
});

// Routes
router.post('/upload', verifyToken, upload.single('file'), documentController.uploadDocument);
router.get('/list', verifyToken, documentController.listDocuments);
router.delete('/:documentId', verifyToken, documentController.deleteDocument);
router.get('/download/:documentId', verifyToken, documentController.downloadDocument);
router.get('/view/:documentId', verifyToken, documentController.viewDocument);

module.exports = router;
