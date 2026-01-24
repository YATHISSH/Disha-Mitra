const { TeamChat } = require('../model/collection');

// Get team chat messages for a company (category: team)
const getTeamChatHistory = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        
        const messages = await TeamChat.find({ company_id: companyId, category: 'team' })
            .sort({ timestamp: 1 })
            .limit(100); // Last 100 messages
        
        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching team chat history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch team chat history' });
    }
};

// Get private chat history between current user and another user (category: private)
const getPrivateChatHistory = async (req, res) => {
    try {
        const companyId = req.user.company_id;
        const currentUserId = req.user.id;
        const otherUserId = parseInt(req.params.otherUserId, 10);

        if (!otherUserId) {
            return res.status(400).json({ success: false, message: 'Invalid otherUserId' });
        }

        const messages = await TeamChat.find({
            company_id: companyId,
            category: 'private',
            $or: [
                { user_id: currentUserId, to_user_id: otherUserId },
                { user_id: otherUserId, to_user_id: currentUserId }
            ]
        }).sort({ timestamp: 1 }).limit(200);

        res.status(200).json({ success: true, messages });
    } catch (error) {
        console.error('Error fetching private chat history:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch private chat history' });
    }
};

module.exports = { getTeamChatHistory, getPrivateChatHistory };
