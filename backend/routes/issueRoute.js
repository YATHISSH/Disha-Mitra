const express = require('express');
const router = express.Router();
const {registerIssue}=require("../controller/issue")
const { sendChatMessage, getChatHistory, getCompanyChatHistory, listChatSessions, getSessionHistory, startChatSession } = require('../controller/chat');
const { verifyToken } = require('../middleware/auth');

router.post('/submit', registerIssue);

// Chat endpoints
router.post('/chat', verifyToken, sendChatMessage);
router.post('/chat/session/start', verifyToken, startChatSession);
router.get('/chat-history', verifyToken, getChatHistory);
router.get('/chat-history/company', verifyToken, getCompanyChatHistory);
// Chat sessions
router.get('/chat/sessions', verifyToken, listChatSessions);
router.get('/chat/session/:sessionId', verifyToken, getSessionHistory);

module.exports=router;