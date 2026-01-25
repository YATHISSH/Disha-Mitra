const { ActivityLog } = require('../model/collection');

// Paths to exclude from logging (e.g., team chat routes)
const EXCLUDED_PATHS = [/^\/team-chat\//];

// Whitelisted routes to log
const ALLOWED_RULES = [
    { method: 'POST', re: /^\/auth\/login/, action: 'LOGIN' },
    { method: 'POST', re: /^\/document\/upload/, action: 'DOCUMENT_UPLOAD' },
    { method: 'GET', re: /^\/document\/download\//, action: 'DOCUMENT_DOWNLOAD' },
    { method: 'GET', re: /^\/document\/view\//, action: 'DOCUMENT_VIEW' },
    { method: 'POST', re: /^\/api-keys\/generate/, action: 'APIKEY_CREATE' },
    { method: 'DELETE', re: /^\/api-keys\/.+\/revoke/, action: 'APIKEY_DELETE' },
];

const activityLogger = (req, res, next) => {
    const startHr = process.hrtime.bigint();
    const path = req.originalUrl || req.url;
    const cleanPath = req.path || path;
    const method = req.method;

    // Skip excluded paths
    if (EXCLUDED_PATHS.some((re) => re.test(cleanPath))) {
        return next();
    }

    // Only log whitelisted routes
    const rule = ALLOWED_RULES.find((r) => r.method === method && r.re.test(cleanPath));
    if (!rule) {
        return next();
    }

    const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
    const userAgent = req.headers['user-agent'] || '';

    res.on('finish', () => {
        const endHr = process.hrtime.bigint();
        const durationMs = Number((endHr - startHr) / 1000000n);
        const statusCode = res.statusCode;

        const action = rule.action || method;

        const log = new ActivityLog({
            company_id: req.user?.company_id,
            user_id: req.user?.id,
            action,
            resource: path,
            result: statusCode,
            ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
            user_agent: userAgent,
            method,
            path: cleanPath,
            duration_ms: durationMs,
            metadata: undefined,
        });

        log.save().catch((err) => {
            console.error('Failed to save activity log:', err);
        });
    });

    next();
};

module.exports = { activityLogger };