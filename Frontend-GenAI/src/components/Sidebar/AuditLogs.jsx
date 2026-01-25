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
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(50);
    const [totalPages, setTotalPages] = useState(0);

    const selectedParams = useMemo(() => {
        if (selectedFilter === 'success') return { result: 'success', action: '' };
        if (selectedFilter === 'failed') return { result: 'failed', action: '' };
        if (selectedFilter === 'login') return { result: 'all', action: 'login' };
        if (selectedFilter === 'document') return { result: 'all', action: 'document' };
        return { result: 'all', action: '' };
    }, [selectedFilter]);

    // Fetch logs with pagination
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
                    page: currentPage,
                    limit: pageSize,
                });
                if (!isCancelled) {
                    setLogs(response?.data || []);
                    setSummary(response?.summary || { success: 0, failed: 0, total: 0 });
                    const { pagination } = response || {};
                    if (pagination) {
                        setTotalPages(Math.ceil(pagination.total / pagination.limit));
                    }
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
    }, [searchTerm, selectedParams, dateRange.start, dateRange.end, currentPage, pageSize]);

    // Reset to page 1 when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, selectedParams, dateRange.start, dateRange.end]);

    const handlePageSizeChange = (newSize) => {
        setPageSize(newSize);
        setCurrentPage(1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePageInput = (pageNum) => {
        const num = Math.max(1, Math.min(pageNum, totalPages));
        setCurrentPage(num);
    };

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

    const startIndex = (currentPage - 1) * pageSize + 1;
    const endIndex = Math.min(currentPage * pageSize, summary.total);

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
                                <p className="text-3xl font-bold text-[#00796b]">{summary.total}</p>
                                <p className="text-sm text-gray-500 mt-1">All time</p>
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
                                <p className="text-sm text-gray-500 mt-1">On this page</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">people</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                        <div className="relative">
                            <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                search
                            </span>
                            <input
                                type="text"
                                placeholder="Search by action, resource, or IP..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                            />
                        </div>

                        <div>
                            <select
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                            >
                                <option value="all">All Activities</option>
                                <option value="success">Successful Actions</option>
                                <option value="failed">Failed Actions</option>
                                <option value="login">Login Activities</option>
                                <option value="document">Document Operations</option>
                            </select>
                        </div>

                        <div>
                            <input
                                type="date"
                                value={dateRange.start}
                                onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                placeholder="Start Date"
                            />
                        </div>

                        <div>
                            <input
                                type="date"
                                value={dateRange.end}
                                onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                placeholder="End Date"
                            />
                        </div>
                    </div>

                    {/* Page Size Selector */}
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-gray-700">Rows per page:</label>
                        <select
                            value={pageSize}
                            onChange={(e) => handlePageSizeChange(parseInt(e.target.value))}
                            className="px-3 py-1 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                        >
                            <option value={10}>10</option>
                            <option value={25}>25</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                            <option value={200}>200</option>
                        </select>
                    </div>
                </div>

                {/* Table */}
                <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-6">
                    {!loading && logs.length > 0 && (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead className="bg-[#e0f2f1] border-b-2 border-[#00796b]">
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
                    )}
                </div>

                {/* Pagination Controls */}
                {!loading && logs.length > 0 && (
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div className="text-sm text-gray-600">
                                Showing <span className="font-semibold">{startIndex}</span> to <span className="font-semibold">{endIndex}</span> of <span className="font-semibold">{summary.total}</span> results
                            </div>

                            <div className="flex items-center gap-4">
                                <button
                                    onClick={handlePreviousPage}
                                    disabled={currentPage === 1 || loading}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Previous page"
                                >
                                    <span className="material-symbols-outlined">chevron_left</span>
                                </button>

                                <div className="flex items-center gap-2">
                                    <span className="text-sm text-gray-600">Page</span>
                                    <input
                                        type="number"
                                        min="1"
                                        max={totalPages}
                                        value={currentPage}
                                        onChange={(e) => handlePageInput(parseInt(e.target.value) || 1)}
                                        className="w-12 px-2 py-1 border border-gray-300 rounded-lg text-center focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                    />
                                    <span className="text-sm text-gray-600">of {totalPages}</span>
                                </div>

                                <button
                                    onClick={handleNextPage}
                                    disabled={currentPage >= totalPages || loading}
                                    className="p-2 rounded-lg border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    title="Next page"
                                >
                                    <span className="material-symbols-outlined">chevron_right</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

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
