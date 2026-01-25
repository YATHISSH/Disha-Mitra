const { APIKey, APIKeyUsage } = require('../model/collection');

// Simple in-memory rate limiter per API key (resets every hour)
const rateBuckets = new Map();

// Middleware to verify API key for external API access
const verifyAPIKey = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const apiKey = req.header('X-API-Key');

            if (!apiKey) {
                return res.status(401).json({ 
                    success: false,
                    error: 'API key required',
                    message: 'Please provide X-API-Key header' 
                });
            }

            // Find active API key
            const key = await APIKey.findOne({ 
                key: apiKey, 
                is_active: true 
            });

            if (!key) {
                return res.status(401).json({ 
                    success: false,
                    error: 'Invalid API key',
                    message: 'The provided API key is invalid or has been revoked' 
                });
            }

            // Check expiry
            if (key.expires_at && key.expires_at < new Date()) {
                return res.status(401).json({ 
                    success: false,
                    error: 'API key expired',
                    message: 'This API key has expired. Please regenerate a new one.' 
                });
            }

            // Check permissions
            if (requiredPermission && !key.permissions.includes(requiredPermission)) {
                return res.status(403).json({ 
                    success: false,
                    error: 'Insufficient permissions',
                    message: `This API key does not have '${requiredPermission}' permission` 
                });
            }

            // Rate limiting per key (requests per hour)
            const now = Date.now();
            const bucket = rateBuckets.get(apiKey) || { count: 0, resetAt: now + 60 * 60 * 1000 };
            if (now > bucket.resetAt) {
                bucket.count = 0;
                bucket.resetAt = now + 60 * 60 * 1000;
            }
            if (bucket.count >= (key.rate_limit || 100)) {
                return res.status(429).json({
                    success: false,
                    error: 'Rate limit exceeded',
                    message: `API key limit reached. Try again after ${new Date(bucket.resetAt).toLocaleTimeString()}`
                });
            }
            bucket.count += 1;
            rateBuckets.set(apiKey, bucket);

            // Attach company context to request
            req.company_id = key.company_id;
            req.apiKeyId = key.id;
            req.apiKeyName = key.name;
            req.apiKeyCreatedBy = key.created_by; // Track who created this API key

            // Capture start time for duration measurement
            const startHr = process.hrtime.bigint();

            // Update last_used_at and usage_count asynchronously and log usage
            const endpointPath = req.originalUrl;
            const method = req.method;
            const ipAddress = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
            const userAgent = req.headers['user-agent'] || '';

            res.on('finish', () => {
                // fire-and-forget logging
                setImmediate(async () => {
                    try {
                        const endHr = process.hrtime.bigint();
                        const durationMs = Number((endHr - startHr) / 1000000n);
                        key.last_used_at = new Date();
                        key.usage_count = (key.usage_count || 0) + 1;
                        await key.save();

                        const usage = new APIKeyUsage({
                            api_key_id: key.id,
                            company_id: key.company_id,
                            endpoint: endpointPath,
                            method,
                            status_code: res.statusCode,
                            duration_ms: durationMs,
                            ip_address: Array.isArray(ipAddress) ? ipAddress[0] : ipAddress,
                            user_agent: userAgent
                        });
                        await usage.save();
                    } catch (err) {
                        console.error('Error updating API key usage:', err);
                    }
                });
            });

            next();
        } catch (error) {
            console.error('Error in API key verification:', error);
            res.status(500).json({ 
                success: false,
                error: 'Authentication error',
                message: 'Failed to verify API key' 
            });
        }
    };
};

module.exports = { verifyAPIKey };
