const { ActivityLog, User } = require('../model/collection');

// List activity logs for a company with filters
const listActivityLogs = async (req, res) => {
    try {
        const companyId = req.user?.company_id;
        if (!companyId) {
            return res.status(401).json({ error: 'Company ID not found in token' });
        }

        const {
            search = '',
            result = 'all', // all | success | failed
            action = '',
            start,
            end,
            page = 1,
            limit = 50,
        } = req.query;

        const query = { company_id: companyId };

        if (action) {
            query.action = { $regex: action, $options: 'i' };
        }

        if (search) {
            const regex = { $regex: search, $options: 'i' };
            query.$or = [
                { action: regex },
                { resource: regex },
                { path: regex },
                { user_agent: regex },
                { ip_address: regex },
            ];
        }

        if (result === 'success') {
            query.result = { $lt: 400 };
        } else if (result === 'failed') {
            query.result = { $gte: 400 };
        }

        if (start || end) {
            query.timestamp = {};
            if (start) query.timestamp.$gte = new Date(start);
            if (end) query.timestamp.$lte = new Date(end);
        }

        const pageNum = Math.max(parseInt(page) || 1, 1);
        const pageSize = Math.min(Math.max(parseInt(limit) || 50, 1), 200);
        const skip = (pageNum - 1) * pageSize;

        const [logs, total, successCount, failedCount] = await Promise.all([
            ActivityLog.find(query).sort({ timestamp: -1 }).skip(skip).limit(pageSize).lean(),
            ActivityLog.countDocuments(query),
            ActivityLog.countDocuments({ ...query, result: { $lt: 400 } }),
            ActivityLog.countDocuments({ ...query, result: { $gte: 400 } }),
        ]);

        // Map user IDs to user emails for display (best-effort)
        const userIds = [...new Set(logs.map((l) => l.user_id).filter(Boolean))];
        let usersById = {};
        if (userIds.length) {
            const users = await User.find({ id: { $in: userIds } }, { id: 1, email: 1, name: 1 }).lean();
            usersById = users.reduce((acc, u) => {
                acc[u.id] = u;
                return acc;
            }, {});
        }

        const data = logs.map((log) => ({
            ...log,
            user_email: usersById[log.user_id]?.email || null,
            user_name: usersById[log.user_id]?.name || null,
            result_text: log.result < 400 ? 'Success' : 'Failed',
        }));

        res.status(200).json({
            success: true,
            data,
            pagination: {
                page: pageNum,
                limit: pageSize,
                total,
            },
            summary: {
                success: successCount,
                failed: failedCount,
                total,
            },
        });
    } catch (error) {
        console.error('Error listing activity logs:', error);
        res.status(500).json({ error: 'Failed to fetch activity logs' });
    }
};

module.exports = { listActivityLogs };