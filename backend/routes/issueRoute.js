const express = require('express');
const router = express.Router();
const {registerIssue}=require("../controller/issue")
const { sendChatMessage, getChatHistory, getCompanyChatHistory } = require('../controller/chat');
const { verifyToken } = require('../middleware/auth');

router.post('/submit', registerIssue);

// Chat endpoints
router.post('/chat', verifyToken, sendChatMessage);
router.get('/chat-history', verifyToken, getChatHistory);
router.get('/chat-history/company', verifyToken, getCompanyChatHistory);

module.exports=router;