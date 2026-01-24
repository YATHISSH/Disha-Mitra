const express = require('express');
const { generateAPIKey, listAPIKeys, revokeAPIKey, regenerateAPIKey, getUsageAnalytics } = require('../controller/apiKey');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All API key management routes require JWT authentication
router.post('/generate', verifyToken, generateAPIKey);
router.get('/list', verifyToken, listAPIKeys);
router.delete('/:id/revoke', verifyToken, revokeAPIKey);
router.post('/:id/regenerate', verifyToken, regenerateAPIKey);
router.get('/analytics/usage', verifyToken, getUsageAnalytics);

module.exports = router;
