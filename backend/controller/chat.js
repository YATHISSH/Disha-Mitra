const axios = require('axios');
const { ChatHistory, ChatSession } = require('../model/collection');
const { getNextId } = require('../model/counter');
const { recordActivity } = require('../utils/auditLogger');

const PYTHON_API_URL = process.env.PYTHON_API_URL || 'http://localhost:8000/api/chat';

// Send chat message and store in history
// Explicit session creation
const startChatSession = async (req, res) => {
    try {
        const userId = req.user?.id;
        const companyId = req.user?.company_id;
        const { title = 'New Session' } = req.body || {};

        if (!companyId || !userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const session = new ChatSession({
            company_id: companyId,
            user_id: userId,
            title,
        });
        await session.save();

        res.status(201).json({ success: true, sessionId: session.id, title: session.title });
    } catch (error) {
        console.error('Error starting chat session:', error);
        res.status(500).json({ success: false, message: 'Failed to start chat session' });
    }
};

const sendChatMessage = async (req, res) => {
    try {
        const rawMessage = (req.body.userMessage ?? req.body.message);
        // For JWT: use req.user.id; for API key: use req.apiKeyCreatedBy (the user who created the API key)
        const userId = req.user?.id || req.apiKeyCreatedBy || null;
        const companyId = (req.user?.company_id) || req.company_id;
        // For API key requests without sessionId, use session_id = 0 (reserved for API chats)
        let sessionId = req.body.sessionId;
        const isApiKeyRequest = !req.user && req.company_id;

        if (!rawMessage || !rawMessage.trim()) {
            await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 400, metadata: { reason: 'missing_message' } });
            return res.status(400).json({ error: 'User message is required' });
        }
        const userMessage = rawMessage.trim();

        if (!companyId) {
            await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 401, metadata: { reason: 'missing_company' } });
            return res.status(401).json({ error: 'Company ID is required' });
        }

        // Create or use session
        if (!sessionId) {
            if (isApiKeyRequest) {
                // For API key requests, use session_id = 0 (reserved for API chats)
                sessionId = 0;
                // Ensure session 0 exists for this company
                const existingSession = await ChatSession.findOne({ id: 0, company_id: companyId });
                if (!existingSession) {
                    const session = new ChatSession({ 
                        id: 0,
                        company_id: companyId, 
                        user_id: null, 
                        title: 'API Chat Session' 
                    });
                    await session.save();
                }
            } else {
                // For app users, create a new session
                const session = new ChatSession({ 
                    company_id: companyId, 
                    user_id: userId, 
                    title: 'New Session' 
                });
                await session.save();
                sessionId = session.id;
            }
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
            session_id: sessionId,
            userMessage: userMessage,
            botResponse: botResponse
        });

        await chatEntry.save();
        // Update session last activity
        await ChatSession.findOneAndUpdate(
            { id: sessionId, company_id: companyId }, 
            { $set: { last_activity: new Date() } }
        );

        // Send response back to frontend
        await recordActivity(req, { action: 'CHAT_SEND', resource: '/issue/chat', result: 200, metadata: { chatId: chatEntry.id, sessionId, isApiKey: isApiKeyRequest } });

        res.status(200).json({
            message: 'Chat processed successfully',
            botResponse: botResponse,
            chatId: chatEntry.id,
            sessionId: sessionId
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
    getCompanyChatHistory,
    startChatSession,
};

// New: List chat sessions for the current user
const listChatSessions = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;

        const sessions = await ChatHistory.aggregate([
            { $match: { company_id: companyId, user_id: userId } },
            { $group: {
                _id: '$session_id',
                last_activity: { $max: '$timestamp' },
                messages: { $sum: 1 },
            }},
            { $sort: { last_activity: -1 } },
            { $project: { _id: 0, session_id: '$_id', last_activity: 1, messages: 1 } }
        ]);

        res.status(200).json({ success: true, sessions });
    } catch (error) {
        console.error('Error listing chat sessions:', error);
        res.status(500).json({ success: false, message: 'Failed to list chat sessions' });
    }
};

// New: Get messages for a specific session
const getSessionHistory = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const userId = req.user.id;
        const sessionId = parseInt(req.params.sessionId, 10);

        if (!sessionId) {
            return res.status(400).json({ success: false, message: 'Invalid sessionId' });
        }

        const history = await ChatHistory.find({
            company_id: companyId,
            user_id: userId,
            session_id: sessionId,
        }).sort({ timestamp: 1 });

        res.status(200).json({ success: true, session_id: sessionId, messages: history });
    } catch (error) {
        console.error('Error fetching session history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch session history' });
    }
};

module.exports.listChatSessions = listChatSessions;
module.exports.getSessionHistory = getSessionHistory;
