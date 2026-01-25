const crypto = require('crypto');
const { APIKey, APIKeyUsage } = require('../model/collection');
const { recordActivity } = require('../utils/auditLogger');

// Generate new API key
const generateAPIKey = async (req, res) => {
    try {
        const { name, permissions, expiresInDays } = req.body;
        const companyId = req.user.company_id;
        const userId = req.user.id;

        if (!name) {
            await recordActivity(req, { action: 'APIKEY_CREATE', resource: '/api-keys/generate', result: 400, metadata: { reason: 'missing_name' } });
            return res.status(400).json({ 
                success: false, 
                message: 'API key name is required' 
            });
        }

        // Generate crypto-random key
        const randomBytes = crypto.randomBytes(32).toString('hex');
        const key = `disha_live_${randomBytes}`;

        // Calculate expiry if provided
        let expiresAt = null;
        if (expiresInDays) {
            expiresAt = new Date();
            expiresAt.setDate(expiresAt.getDate() + parseInt(expiresInDays));
        }

        const apiKey = new APIKey({
            company_id: companyId,
            key: key,
            name: name,
            created_by: userId,
            permissions: permissions || ['upload', 'chat'],
            expires_at: expiresAt
        });

        await apiKey.save();

        await recordActivity(req, { action: 'APIKEY_CREATE', resource: apiKey.name, result: 201, metadata: { id: apiKey.id, path: '/api-keys/generate', name: apiKey.name } });

        res.status(201).json({
            success: true,
            message: 'API key generated successfully',
            apiKey: {
                id: apiKey.id,
                key: key, // Show full key only once
                name: apiKey.name,
                permissions: apiKey.permissions,
                created_at: apiKey.created_at,
                expires_at: apiKey.expires_at
            }
        });
    } catch (error) {
        console.error('Error generating API key:', error);
        await recordActivity(req, { action: 'APIKEY_CREATE', resource: '/api-keys/generate', result: 500, metadata: { error: error.message } });
        res.status(500).json({ 
            success: false, 
            message: 'Failed to generate API key',
            error: error.message 
        });
    }
};

// List all API keys for company (masked)
const listAPIKeys = async (req, res) => {
    try {
        const companyId = req.user.company_id;

        const apiKeys = await APIKey.find({ company_id: companyId })
            .sort({ created_at: -1 });

        const maskedKeys = apiKeys.map(key => ({
            id: key.id,
            name: key.name,
            key_preview: `${key.key.substring(0, 15)}...${key.key.slice(-4)}`, // disha_live_abc...xyz4
            permissions: key.permissions,
            created_at: key.created_at,
            last_used_at: key.last_used_at,
            expires_at: key.expires_at,
            is_active: key.is_active,
            usage_count: key.usage_count
        }));

        res.status(200).json({
            success: true,
            count: maskedKeys.length,
            apiKeys: maskedKeys
        });
    } catch (error) {
        console.error('Error listing API keys:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to list API keys',
            error: error.message 
        });
    }
};

// Revoke API key
const revokeAPIKey = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company_id;

        const apiKey = await APIKey.findOne({ id: parseInt(id), company_id: companyId });

        if (!apiKey) {
            await recordActivity(req, { action: 'APIKEY_REVOKE', resource: `/api-keys/${id}/revoke`, result: 404 });
            return res.status(404).json({ 
                success: false, 
                message: 'API key not found' 
            });
        }

        apiKey.is_active = false;
        await apiKey.save();
        await recordActivity(req, { action: 'APIKEY_REVOKE', resource: apiKey.name, result: 200, metadata: { id: apiKey.id, path: `/api-keys/${id}/revoke` } });

        res.status(200).json({
            success: true,
            message: 'API key revoked successfully'
        });
    } catch (error) {
        console.error('Error revoking API key:', error);
        await recordActivity(req, { action: 'APIKEY_REVOKE', resource: `/api-keys/${req.params?.id}/revoke`, result: 500, metadata: { error: error.message } });
        res.status(500).json({ 
            success: false, 
            message: 'Failed to revoke API key',
            error: error.message 
        });
    }
};

// Regenerate API key
const regenerateAPIKey = async (req, res) => {
    try {
        const { id } = req.params;
        const companyId = req.user.company_id;

        const oldKey = await APIKey.findOne({ id: parseInt(id), company_id: companyId });

        if (!oldKey) {
            await recordActivity(req, { action: 'APIKEY_REGENERATE', resource: `/api-keys/${id}/regenerate`, result: 404 });
            return res.status(404).json({ 
                success: false, 
                message: 'API key not found' 
            });
        }

        // Revoke old key
        oldKey.is_active = false;
        await oldKey.save();

        // Generate new key with same settings
        const randomBytes = crypto.randomBytes(32).toString('hex');
        const newKeyString = `disha_live_${randomBytes}`;

        const newApiKey = new APIKey({
            company_id: companyId,
            key: newKeyString,
            name: oldKey.name,
            created_by: req.user.id,
            permissions: oldKey.permissions,
            expires_at: oldKey.expires_at
        });

        await newApiKey.save();
        await recordActivity(req, { action: 'APIKEY_REGENERATE', resource: newApiKey.name, result: 201, metadata: { newId: newApiKey.id, oldId: oldKey.id, path: `/api-keys/${id}/regenerate` } });

        res.status(201).json({
            success: true,
            message: 'API key regenerated successfully',
            apiKey: {
                id: newApiKey.id,
                key: newKeyString, // Show full key only once
                name: newApiKey.name,
                permissions: newApiKey.permissions,
                created_at: newApiKey.created_at,
                expires_at: newApiKey.expires_at
            }
        });
    } catch (error) {
        console.error('Error regenerating API key:', error);
        await recordActivity(req, { action: 'APIKEY_REGENERATE', resource: `/api-keys/${req.params?.id}/regenerate`, result: 500, metadata: { error: error.message } });
        res.status(500).json({ 
            success: false, 
            message: 'Failed to regenerate API key',
            error: error.message 
        });
    }
};

// Get usage analytics for a specific API key or all keys in company
const getUsageAnalytics = async (req, res) => {
    try {
        const { keyId, period = '24h' } = req.query;
        const companyId = req.user.company_id;

        // Verify API key belongs to company
        if (keyId) {
            const apiKey = await APIKey.findOne({ 
                id: parseInt(keyId), 
                company_id: companyId 
            });
            if (!apiKey) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'API key not found' 
                });
            }
        }

        // Calculate date range based on period
        const now = new Date();
        let startDate = new Date();
        
        switch (period) {
            case '1h':
                startDate.setHours(startDate.getHours() - 1);
                break;
            case '24h':
                startDate.setDate(startDate.getDate() - 1);
                break;
            case '7d':
                startDate.setDate(startDate.getDate() - 7);
                break;
            case '30d':
                startDate.setDate(startDate.getDate() - 30);
                break;
            default:
                startDate.setDate(startDate.getDate() - 1);
        }

        // Build query
        const query = { company_id: companyId, timestamp: { $gte: startDate, $lte: now } };
        if (keyId) {
            query.api_key_id = parseInt(keyId);
        }

        // Get usage records
        const usageRecords = await APIKeyUsage.find(query)
            .sort({ timestamp: -1 })
            .limit(1000);

        // Aggregate stats
        const stats = {
            total_requests: usageRecords.length,
            period,
            start_date: startDate,
            end_date: now,
            by_endpoint: {},
            by_method: {},
            by_status: {},
            by_hour: {},
            avg_response_time_ms: null,
            previous_avg_response_time_ms: null,
            delta_ms: null,
            recent_logs: usageRecords.slice(0, 50) // Last 50 logs
        };

        // Calculate aggregates
        usageRecords.forEach(record => {
            // By endpoint
            stats.by_endpoint[record.endpoint] = (stats.by_endpoint[record.endpoint] || 0) + 1;

            // By method
            stats.by_method[record.method] = (stats.by_method[record.method] || 0) + 1;

            // By status code
            const statusGroup = `${Math.floor(record.status_code / 100)}xx`;
            stats.by_status[statusGroup] = (stats.by_status[statusGroup] || 0) + 1;

            // By hour
            const hour = new Date(record.timestamp).toISOString().split('T')[0] + 
                         ' ' + new Date(record.timestamp).getHours() + ':00';
            stats.by_hour[hour] = (stats.by_hour[hour] || 0) + 1;
        });

        // Compute average response time for current period
        const durations = usageRecords.map(r => r.duration_ms).filter(d => typeof d === 'number');
        if (durations.length > 0) {
            stats.avg_response_time_ms = Math.round(durations.reduce((a, b) => a + b, 0) / durations.length);
        }

        // Compute previous period average for delta comparison
        const rangeMs = now.getTime() - startDate.getTime();
        const prevStart = new Date(startDate.getTime() - rangeMs);
        const prevEnd = startDate;
        const prevQuery = { company_id: companyId, timestamp: { $gte: prevStart, $lte: prevEnd } };
        if (keyId) {
            prevQuery.api_key_id = parseInt(keyId);
        }
        const prevRecords = await APIKeyUsage.find(prevQuery).limit(1000);
        const prevDurations = prevRecords.map(r => r.duration_ms).filter(d => typeof d === 'number');
        if (prevDurations.length > 0) {
            stats.previous_avg_response_time_ms = Math.round(prevDurations.reduce((a, b) => a + b, 0) / prevDurations.length);
        }
        if (stats.avg_response_time_ms !== null && stats.previous_avg_response_time_ms !== null) {
            stats.delta_ms = stats.avg_response_time_ms - stats.previous_avg_response_time_ms;
        }

        // Add API key info if specific key requested
        if (keyId) {
            const apiKey = await APIKey.findOne({ 
                id: parseInt(keyId), 
                company_id: companyId 
            });
            stats.api_key_info = {
                id: apiKey.id,
                name: apiKey.name,
                rate_limit: apiKey.rate_limit,
                usage_count: apiKey.usage_count,
                last_used_at: apiKey.last_used_at,
                is_active: apiKey.is_active
            };
        }

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        console.error('Error fetching usage analytics:', error);
        res.status(500).json({ 
            success: false, 
            message: 'Failed to fetch usage analytics',
            error: error.message 
        });
    }
};

module.exports = {
    generateAPIKey,
    listAPIKeys,
    revokeAPIKey,
    regenerateAPIKey,
    getUsageAnalytics
};
