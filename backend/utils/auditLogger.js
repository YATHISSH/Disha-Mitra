const { ActivityLog } = require('../model/collection');

// Record an activity log without blocking controller flow
const recordActivity = async (req, {
    action,
    resource,
    result,
    method,
    metadata,
    companyId,
    userId,
}) => {
    try {
        const resolvedCompanyId = companyId || req.user?.company_id || req.company_id;
        const resolvedUserId = userId || req.user?.id || req.body?.userId || req.body?.user_id;
        const path = req.path || req.originalUrl || req.url;
        const ipHeader = req.headers['x-forwarded-for'];
        const ipForwarded = Array.isArray(ipHeader) ? ipHeader[0] : (ipHeader?.split(',')[0] || '');
        const ipReal = req.headers['x-real-ip'] || '';
        const ipSocket = req.socket?.remoteAddress || '';
        let ip = ipForwarded || ipReal || ipSocket;
        if (ip.startsWith('::ffff:')) ip = ip.replace('::ffff:', '');
        const ipNormalized = (ip === '::1' || ip === '127.0.0.1') ? '127.0.0.1' : ip;
        const userAgent = req.headers['user-agent'] || '';

        await ActivityLog.create({
            company_id: resolvedCompanyId,
            user_id: resolvedUserId,
            action: action || req.method,
            resource: resource || path,
            result: typeof result === 'number' ? result : 200,
            ip_address: ipNormalized,
            user_agent: userAgent,
            method: method || req.method,
            path,
            metadata,
        });
    } catch (err) {
        console.error('Failed to record activity log:', err.message);
    }
};

module.exports = { recordActivity };
