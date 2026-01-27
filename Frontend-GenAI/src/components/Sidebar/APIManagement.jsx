const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createAPIKey, listAPIKeys, revokeAPIKey, regenerateAPIKey, getAPIUsageAnalytics } from '../../api';

const APIManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('overview');
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showKeyModal, setShowKeyModal] = useState(false);
    const [generatedKey, setGeneratedKey] = useState(null);
    const [apiKeys, setApiKeys] = useState([]);
    const [loading, setLoading] = useState(false);
    const [analytics, setAnalytics] = useState(null);
    const [analyticsLoading, setAnalyticsLoading] = useState(false);
    const [analyticsPeriod, setAnalyticsPeriod] = useState('7d');
    
    // Form state
    const [formData, setFormData] = useState({
        name: '',
        permissions: ['upload', 'chat'],
        expiresInDays: ''
    });

    useEffect(() => {
        loadAPIKeys();
    }, []);

    useEffect(() => {
        loadAnalytics();
    }, [analyticsPeriod]);

    const loadAPIKeys = async () => {
        try {
            setLoading(true);
            const keys = await listAPIKeys();
            setApiKeys(keys);
        } catch (error) {
            console.error('Error loading API keys:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadAnalytics = async () => {
        try {
            setAnalyticsLoading(true);
            const data = await getAPIUsageAnalytics(analyticsPeriod);
            setAnalytics(data);
        } catch (error) {
            console.error('Error loading analytics:', error);
        } finally {
            setAnalyticsLoading(false);
        }
    };

    const handleCreateKey = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            const result = await createAPIKey(
                formData.name,
                formData.permissions,
                formData.expiresInDays || null
            );
            
            setGeneratedKey(result.apiKey);
            setShowCreateModal(false);
            setShowKeyModal(true);
            setFormData({ name: '', permissions: ['upload', 'chat'], expiresInDays: '' });
            loadAPIKeys();
        } catch (error) {
            console.error('Error creating API key:', error);
            alert('Failed to create API key');
        } finally {
            setLoading(false);
        }
    };

    const handleRevokeKey = async (id) => {
        if (!confirm('Are you sure you want to revoke this API key? This action cannot be undone.')) {
            return;
        }
        try {
            setLoading(true);
            await revokeAPIKey(id);
            loadAPIKeys();
        } catch (error) {
            console.error('Error revoking API key:', error);
            alert('Failed to revoke API key');
        } finally {
            setLoading(false);
        }
    };

    const handleRegenerateKey = async (id) => {
        if (!confirm('Are you sure you want to regenerate this API key? The old key will be revoked.')) {
            return;
        }
        try {
            setLoading(true);
            const result = await regenerateAPIKey(id);
            setGeneratedKey(result.apiKey);
            setShowKeyModal(true);
            loadAPIKeys();
        } catch (error) {
            console.error('Error regenerating API key:', error);
            alert('Failed to regenerate API key');
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        alert('Copied to clipboard!');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'Never';
        const date = new Date(dateString);
        return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    };

    const calculateTotalRequests = () => {
        return apiKeys.reduce((sum, key) => sum + (key.usage_count || 0), 0);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">api</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">API Management</h1>
                                <p className="text-gray-600">Manage API keys, endpoints, and monitor usage</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-3">
                            <button 
                                onClick={() => setShowCreateModal(true)}
                                className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004d40] transition-colors duration-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create API Key
                            </button>
                            <button 
                                onClick={() => navigate('/docs/api')}
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">description</span>
                                View Docs
                            </button>
                        </div>
                    </div>
                </div>

                {/* API Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Requests</p>
                                <p className="text-3xl font-bold text-[#00796b]">{calculateTotalRequests().toLocaleString()}</p>
                                <p className="text-sm text-gray-500 mt-1">Across all API keys</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">trending_up</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Success Rate</p>
                                <p className="text-3xl font-bold text-green-600">
                                    {analyticsLoading || !analytics ? '—' : (() => {
                                        const total = analytics.total_requests || 0;
                                        const byStatus = analytics.by_status || {};
                                        const success = (byStatus['2xx'] || 0) + (byStatus['3xx'] || 0);
                                        return total > 0 ? `${((success / total) * 100).toFixed(1)}%` : '—';
                                    })()}
                                </p>
                                <p className="text-sm text-gray-600 mt-1">Period: {analyticsPeriod}</p>
                            </div>
                            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Response Time</p>
                                <p className="text-3xl font-bold text-[#00796b]">
                                    {analyticsLoading || !analytics || analytics.avg_response_time_ms == null 
                                        ? '—' 
                                        : `${analytics.avg_response_time_ms}ms`}
                                </p>
                                <p className={`text-sm mt-1 ${analytics?.delta_ms > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                    {analyticsLoading || !analytics || analytics.delta_ms == null ? '—' : (
                                        `${analytics.delta_ms > 0 ? '↑' : '↓'} ${Math.abs(analytics.delta_ms)}ms from last period`
                                    )}
                                </p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">speed</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Keys</p>
                                <p className="text-3xl font-bold text-[#00796b]">{apiKeys.filter(k => k.is_active).length}</p>
                                <p className="text-sm text-gray-600 mt-1">out of {apiKeys.length} total</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">vpn_key</span>
                        </div>
                    </div>
                </div>

                {/* Analytics Period Selector */}
                <div className="flex items-center justify-end mb-4">
                    <label className="text-sm text-gray-700 mr-2">Analytics period:</label>
                    <select
                        value={analyticsPeriod}
                        onChange={(e) => setAnalyticsPeriod(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                    >
                        <option value="1h">1h</option>
                        <option value="24h">24h</option>
                        <option value="7d">7d</option>
                        <option value="30d">30d</option>
                    </select>
                </div>

                {/* API Keys Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-[#004d40] mb-6">API Keys</h3>
                    {loading ? (
                        <div className="text-center py-8 text-gray-500">Loading...</div>
                    ) : apiKeys.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <p>No API keys yet. Create one to get started!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {apiKeys.map(key => (
                                <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-2">
                                                <h4 className="font-semibold text-[#004d40]">{key.name}</h4>
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    key.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {key.is_active ? 'ACTIVE' : 'REVOKED'}
                                                </span>
                                            </div>
                                            <div className="flex flex-col gap-2 text-sm text-gray-600">
                                                <div className="flex items-center gap-2">
                                                    <code className="bg-gray-100 px-3 py-1 rounded">{key.key_preview}</code>
                                                    <button 
                                                        onClick={() => copyToClipboard(key.key_preview)}
                                                        className="text-[#00796b] hover:underline text-xs"
                                                    >
                                                        Copy
                                                    </button>
                                                </div>
                                                <div className="flex gap-4">
                                                    <span><strong>{key.usage_count}</strong> requests</span>
                                                    <span>Last used: {formatDate(key.last_used_at)}</span>
                                                    <span>Permissions: {key.permissions.join(', ')}</span>
                                                </div>
                                                {key.expires_at && (
                                                    <span className="text-yellow-600">Expires: {formatDate(key.expires_at)}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleRegenerateKey(key.id)}
                                                disabled={!key.is_active || loading}
                                                className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg disabled:opacity-50"
                                                title="Regenerate"
                                            >
                                                <span className="material-symbols-outlined">refresh</span>
                                            </button>
                                            <button 
                                                onClick={() => handleRevokeKey(key.id)}
                                                disabled={!key.is_active || loading}
                                                className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg disabled:opacity-50"
                                                title="Revoke"
                                            >
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* API Documentation Preview */}
                <div className="bg-white rounded-lg shadow-lg p-6 mt-6">
                    <h3 className="text-xl font-semibold text-[#004d40] mb-4">Quick Start</h3>
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-sm text-gray-600 mb-3">Example: Chat with AI using your API key</p>
                        <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`curl -X POST ${BACKEND_URL}/api/v1/chat \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What is the company policy?"}'`}
                        </pre>
                    </div>
                </div>

                {/* Create API Key Modal */}
                {showCreateModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-md w-full mx-4">
                            <h3 className="text-xl font-semibold text-[#004d40] mb-4">Create API Key</h3>
                            <form onSubmit={handleCreateKey}>
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Key Name <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        placeholder="e.g., Production Key"
                                        required
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                    />
                                </div>
                                
                                <div className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">Permissions</label>
                                    <div className="space-y-2">
                                        {['upload', 'chat', 'search', 'delete'].map(perm => (
                                            <label key={perm} className="flex items-center gap-2">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.permissions.includes(perm)}
                                                    onChange={(e) => {
                                                        if (e.target.checked) {
                                                            setFormData({...formData, permissions: [...formData.permissions, perm]});
                                                        } else {
                                                            setFormData({...formData, permissions: formData.permissions.filter(p => p !== perm)});
                                                        }
                                                    }}
                                                    className="rounded text-[#00796b] focus:ring-[#00796b]"
                                                />
                                                <span className="text-sm text-gray-700 capitalize">{perm}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Expires In (Days)
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.expiresInDays}
                                        onChange={(e) => setFormData({...formData, expiresInDays: e.target.value})}
                                        placeholder="Leave empty for no expiration"
                                        min="1"
                                        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                    />
                                </div>

                                <div className="flex gap-2">
                                    <button
                                        type="submit"
                                        disabled={loading}
                                        className="flex-1 bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] disabled:opacity-50"
                                    >
                                        {loading ? 'Creating...' : 'Create Key'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowCreateModal(false)}
                                        disabled={loading}
                                        className="flex-1 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 disabled:opacity-50"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}

                {/* Show Generated Key Modal */}
                {showKeyModal && generatedKey && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                        <div className="bg-white rounded-lg shadow-xl p-6 max-w-2xl w-full mx-4">
                            <div className="mb-4">
                                <h3 className="text-xl font-semibold text-[#004d40] mb-2">API Key Created!</h3>
                                <p className="text-sm text-red-600">⚠️ Save this key now! It won't be shown again.</p>
                            </div>
                            
                            <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">API Key</label>
                                <div className="flex gap-2">
                                    <code className="flex-1 bg-white border border-gray-300 px-4 py-2 rounded text-sm overflow-x-auto">
                                        {generatedKey.key}
                                    </code>
                                    <button
                                        onClick={() => copyToClipboard(generatedKey.key)}
                                        className="bg-[#00796b] text-white px-4 py-2 rounded hover:bg-[#004d40]"
                                    >
                                        Copy
                                    </button>
                                </div>
                            </div>

                            <div className="mb-4 grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <span className="text-gray-600">Name:</span> <strong>{generatedKey.name}</strong>
                                </div>
                                <div>
                                    <span className="text-gray-600">Permissions:</span> <strong>{generatedKey.permissions.join(', ')}</strong>
                                </div>
                                {generatedKey.expires_at && (
                                    <div className="col-span-2">
                                        <span className="text-gray-600">Expires:</span> <strong>{formatDate(generatedKey.expires_at)}</strong>
                                    </div>
                                )}
                            </div>

                            <button
                                onClick={() => {setShowKeyModal(false); setGeneratedKey(null);}}
                                className="w-full bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40]"
                            >
                                I've Saved My Key
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default APIManagement;
