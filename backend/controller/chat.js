const axios = require('axios');
const { ChatHistory } = require('../model/collection');

const PYTHON_API_URL = 'http://localhost:8000/api/chat';

// Send chat message and store in history
const sendChatMessage = async (req, res) => {
    try {
        const { userMessage } = req.body;
        const userId = req.user.id;
        const companyId = req.user.company_id;

        if (!userMessage || !userMessage.trim()) {
            return res.status(400).json({ error: 'User message is required' });
        }

        if (!userId || !companyId) {
            return res.status(401).json({ error: 'User information not found in token' });
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
        res.status(200).json({
            message: 'Chat processed successfully',
            botResponse: botResponse,
            chatId: chatEntry.id
        });

    } catch (error) {
        console.error('Error processing chat:', error);

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
