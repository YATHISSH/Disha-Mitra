const axios = require('axios');
const { ChatHistory } = require('../model/collection');
const { recordActivity } = require('../utils/auditLogger');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000/api/chat';

// Send chat message and store in history
const sendChatMessage = async (req, res) => {
    try {
        const rawMessage = (req.body.userMessage ?? req.body.message);
        const userId = (req.user?.id) || req.body.userId || 0;
        const companyId = (req.user?.company_id) || req.company_id;

        if (!rawMessage || !rawMessage.trim()) {
            await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 400, metadata: { reason: 'missing_message' } });
            return res.status(400).json({ error: 'User message is required' });
        }
        const userMessage = rawMessage.trim();

        if (!companyId) {
            await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 401, metadata: { reason: 'missing_company' } });
            return res.status(401).json({ error: 'Company ID is required' });
        }

        // Call Python API to get bot response
        const pythonResponse = await axios.post(PYTHON_API_URL, {
            userMessage: userMessage,
            companyId: companyId,
            userId: userId
        });

        const botResponse = pythonResponse.data.botResponse || 'Sorry, I could not process your request.';

        // Store chat in database
        const chatEntry = new ChatHistory({
            company_id: companyId,
            user_id: userId,
            userMessage: userMessage,
            botResponse: botResponse
        });

        await chatEntry.save();

        // Send response back to frontend
        await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 200, metadata: { chatId: chatEntry.id } });

        res.status(200).json({
            message: 'Chat processed successfully',
            botResponse: botResponse,
            chatId: chatEntry.id
        });

    } catch (error) {
        console.error('Error processing chat:', error);

        await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 500, metadata: { error: error.message } });

        if (error.response?.status === 500) {
            return res.status(500).json({ error: 'Python API server error' });
        }

        res.status(500).json({ error: 'Failed to process chat message' });
    }
};

// Get chat history for a user
const getChatHistory = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;

        const history = await ChatHistory.find({
            company_id: companyId,
            user_id: userId
        }).sort({ timestamp: -1 });

        res.status(200).json({
            message: 'Chat history retrieved successfully',
            chatHistory: history,
            count: history.length
        });

    } catch (error) {
        console.error('Error fetching chat history:', error);
        res.status(500).json({ error: 'Failed to fetch chat history' });
    }
};

// Get all chat history for company
const getCompanyChatHistory = async (req, res) => {
    try {
        const companyId = req.user.company_id;

        const history = await ChatHistory.find({
            company_id: companyId
        }).sort({ timestamp: -1 });

        res.status(200).json({
            message: 'Company chat history retrieved successfully',
            chatHistory: history,
            count: history.length
        });

    } catch (error) {
        console.error('Error fetching company chat history:', error);
        res.status(500).json({ error: 'Failed to fetch company chat history' });
    }
};

module.exports = {
    sendChatMessage,
    getChatHistory,
    getCompanyChatHistory
};
