const express = require('express');
const { getTeamChatHistory, getPrivateChatHistory } = require('../controller/teamChat');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// Get team chat history for company
router.get('/history', verifyToken, getTeamChatHistory);

// Get private chat history with a specific user
router.get('/private/history/:otherUserId', verifyToken, getPrivateChatHistory);

module.exports = router;
