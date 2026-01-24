const express = require('express');
const multer = require('multer');
const { verifyAPIKey } = require('../middleware/apiKeyAuth');
const documentController = require('../controller/document');
const { sendChatMessage } = require('../controller/chat');

const router = express.Router();

// Configure multer for memory storage (same as internal upload)
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 },
});

// External API routes secured by API Key
router.post('/upload', verifyAPIKey('upload'), upload.single('file'), documentController.uploadDocument);
router.post('/chat', verifyAPIKey('chat'), sendChatMessage);
router.get('/documents', verifyAPIKey('search'), documentController.listDocuments);

module.exports = router;
