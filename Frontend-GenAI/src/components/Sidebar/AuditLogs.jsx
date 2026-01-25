import { useEffect, useMemo, useState } from 'react';
import { getAuditLogs } from '../../api';

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });
    const [logs, setLogs] = useState([]);
    const [summary, setSummary] = useState({ success: 0, failed: 0, total: 0 });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const selectedParams = useMemo(() => {
        if (selectedFilter === 'success') return { result: 'success', action: '' };
        if (selectedFilter === 'failed') return { result: 'failed', action: '' };
        if (selectedFilter === 'login') return { result: 'all', action: 'login' };
        if (selectedFilter === 'document') return { result: 'all', action: 'document' };
        return { result: 'all', action: '' };
    }, [selectedFilter]);

    useEffect(() => {
        let isCancelled = false;
        const fetchLogs = async () => {
            setLoading(true);
            setError('');
            try {
                const response = await getAuditLogs({
                    search: searchTerm.trim(),
                    result: selectedParams.result,
                    action: selectedParams.action,
                    start: dateRange.start || undefined,
                    end: dateRange.end || undefined,
                    page: 1,
                    limit: 200,
                });
                if (!isCancelled) {
                    setLogs(response?.data || []);
                    setSummary(response?.summary || { success: 0, failed: 0, total: (response?.data || []).length });
                }
            } catch (err) {
                console.error('Error fetching audit logs:', err);
                if (!isCancelled) setError('Failed to load audit logs');
            } finally {
                if (!isCancelled) setLoading(false);
            }
        };

        fetchLogs();
        return () => {
            isCancelled = true;
        };
    }, [searchTerm, selectedParams, dateRange.start, dateRange.end]);

    const exportLogs = () => {
        const csvContent = [
            ['Timestamp', 'User', 'Action', 'Resource', 'Result', 'IP Address'],
            ...logs.map(log => [
                log.timestamp,
                log.user_email || log.user_name || log.user_id || 'unknown',
                log.action,
                log.resource || log.path || '',
                log.result_text || (log.result < 400 ? 'Success' : 'Failed'),
                log.ip_address || ''
            ])
        ].map(row => row.join(',')).join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">assignment</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Audit Logs</h1>
                                <p className="text-gray-600">Track and monitor all system activities</p>
                            </div>
                        </div>
                        <button 
                            onClick={exportLogs}
                            className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004d40] transition-colors duration-200 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">download</span>
                            Export Logs
                        </button>
                    </div>
                </div>

                {/* Summary Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Activities</p>
                                <p className="text-3xl font-bold text-[#00796b]">{summary.total || logs.length}</p>
                                <p className="text-sm text-gray-500 mt-1">Today</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">activity_zone</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Successful Actions</p>
                                <p className="text-3xl font-bold text-green-600">{summary.success}</p>
                                <p className="text-sm text-green-600 mt-1">{summary.total ? Math.round((summary.success / summary.total) * 100) : 0}% success rate</p>
                            </div>
                            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Failed Attempts</p>
                                <p className="text-3xl font-bold text-red-600">{summary.failed}</p>
                                <p className="text-sm text-red-600 mt-1">Requires attention</p>
                            </div>
                            <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Unique Users</p>
                                <p className="text-3xl font-bold text-[#00796b]">{new Set(logs.map(log => log.user_email || log.user_name || log.user_id || 'unknown')).size}</p>
                                <p className="text-sm text-gray-500 mt-1">Active today</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">people</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search logs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:border-transparent"
                            />
                        </div>
                        
                        <select 
                            value={selectedFilter}
                            onChange={(e) => setSelectedFilter(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                        >
                            <option value="all">All Activities</option>
                            <option value="success">Successful Only</option>
                            <option value="failed">Failed Only</option>
                            <option value="login">Login Activities</option>
                            <option value="document">Document Activities</option>
                        </select>

                        <input
                            type="date"
                            value={dateRange.start}
                            onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                        />

                        <input
                            type="date"
                            value={dateRange.end}
                            onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                            className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                        />
                    </div>
                </div>

                {/* Audit Logs Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Timestamp</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">User</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Action</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Resource</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Result</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">IP Address</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((log) => {
                                    const userLabel = log.user_email || log.user_name || log.user_id || 'unknown';
                                    const resultLabel = log.result_text || (log.result < 400 ? 'Success' : 'Failed');
                                    const actionLabel = log.action || 'ACTION';
                                    const timestamp = log.timestamp ? new Date(log.timestamp).toLocaleString() : '';
                                    return (
                                        <tr key={log._id || `${log.timestamp}-${log.resource}`} className="border-t hover:bg-gray-50">
                                            <td className="p-4 text-sm font-mono">{timestamp}</td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-[#e0f2f1] rounded-full flex items-center justify-center text-sm">
                                                        {userLabel.charAt(0).toUpperCase()}
                                                    </div>
                                                    <span className="text-sm">{userLabel}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    actionLabel.toLowerCase().includes('login') ? 'bg-blue-100 text-blue-600' :
                                                    actionLabel.toLowerCase().includes('document') ? 'bg-green-100 text-green-600' :
                                                    actionLabel.toLowerCase().includes('api') ? 'bg-purple-100 text-purple-600' :
                                                    actionLabel.toLowerCase().includes('user') ? 'bg-orange-100 text-orange-600' :
                                                    'bg-gray-100 text-gray-600'
                                                }`}>
                                                    {actionLabel}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm">
                                                <code className="bg-gray-100 px-2 py-1 rounded text-xs">{log.resource || log.path || ''}</code>
                                            </td>
                                            <td className="p-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                    resultLabel === 'Success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                                }`}>
                                                    {resultLabel}
                                                </span>
                                            </td>
                                            <td className="p-4 text-sm font-mono text-gray-600">{log.ip_address || ''}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>

                {loading && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center mt-6">
                        <span className="material-symbols-outlined text-6xl text-[#00796b] mb-4 animate-spin">progress_activity</span>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">Loading audit logs…</h3>
                        <p className="text-gray-500">Fetching the latest activity records.</p>
                    </div>
                )}

                {!loading && error && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center mt-6">
                        <span className="material-symbols-outlined text-6xl text-red-300 mb-4">error</span>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">{error}</h3>
                        <p className="text-gray-500">Please retry or adjust your filters.</p>
                    </div>
                )}

                {!loading && !error && logs.length === 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-12 text-center mt-6">
                        <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">search_off</span>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No audit logs found</h3>
                        <p className="text-gray-500">Try adjusting your search criteria or date range.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuditLogs;
