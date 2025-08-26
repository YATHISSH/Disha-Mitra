import { useState } from 'react';

const AuditLogs = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [dateRange, setDateRange] = useState({ start: '', end: '' });

    const auditLogs = [
        { id: 1, timestamp: '2025-02-26 14:30:15', user: 's.yathissh@company.com', action: 'Document Access', resource: 'Security_Policy.pdf', result: 'Success', ip: '192.168.1.100' },
        { id: 2, timestamp: '2025-02-26 14:25:42', user: 'rishi.kumar.s@company.com', action: 'User Login', resource: 'System', result: 'Success', ip: '192.168.1.101' },
        { id: 3, timestamp: '2025-02-26 14:22:18', user: 'sachin.a@company.com', action: 'API Call', resource: '/api/documents', result: 'Success', ip: '192.168.1.102' },
        { id: 4, timestamp: '2025-02-26 14:20:05', user: 'unknown_user', action: 'Login Attempt', resource: 'System', result: 'Failed', ip: '192.168.1.103' },
        { id: 5, timestamp: '2025-02-26 14:15:30', user: 'jashvarthini.r@company.com', action: 'Document Upload', resource: 'Training_Manual.docx', result: 'Success', ip: '192.168.1.104' },
        { id: 6, timestamp: '2025-02-26 14:10:12', user: 'admin@company.com', action: 'User Creation', resource: 'new.user@company.com', result: 'Success', ip: '192.168.1.105' },
        { id: 7, timestamp: '2025-02-26 14:05:45', user: 'nj.meenakshi@company.com', action: 'Permission Change', resource: 'User Role', result: 'Success', ip: '192.168.1.106' },
        { id: 8, timestamp: '2025-02-26 14:00:33', user: 'system', action: 'Backup Created', resource: 'Database', result: 'Success', ip: 'localhost' }
    ];

    const filteredLogs = auditLogs.filter(log => {
        const matchesSearch = log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             log.resource.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || 
                             (selectedFilter === 'success' && log.result === 'Success') ||
                             (selectedFilter === 'failed' && log.result === 'Failed') ||
                             (selectedFilter === 'login' && log.action.toLowerCase().includes('login')) ||
                             (selectedFilter === 'document' && log.action.toLowerCase().includes('document'));
        return matchesSearch && matchesFilter;
    });

    const exportLogs = () => {
        const csvContent = [
            ['Timestamp', 'User', 'Action', 'Resource', 'Result', 'IP Address'],
            ...filteredLogs.map(log => [log.timestamp, log.user, log.action, log.resource, log.result, log.ip])
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
                                <p className="text-3xl font-bold text-[#00796b]">{auditLogs.length}</p>
                                <p className="text-sm text-gray-500 mt-1">Today</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">activity_zone</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Successful Actions</p>
                                <p className="text-3xl font-bold text-green-600">{auditLogs.filter(log => log.result === 'Success').length}</p>
                                <p className="text-sm text-green-600 mt-1">{Math.round((auditLogs.filter(log => log.result === 'Success').length / auditLogs.length) * 100)}% success rate</p>
                            </div>
                            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Failed Attempts</p>
                                <p className="text-3xl font-bold text-red-600">{auditLogs.filter(log => log.result === 'Failed').length}</p>
                                <p className="text-sm text-red-600 mt-1">Requires attention</p>
                            </div>
                            <span className="material-symbols-outlined text-red-600 text-4xl">error</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Unique Users</p>
                                <p className="text-3xl font-bold text-[#00796b]">{new Set(auditLogs.map(log => log.user)).size}</p>
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
                                {filteredLogs.map((log) => (
                                    <tr key={log.id} className="border-t hover:bg-gray-50">
                                        <td className="p-4 text-sm font-mono">{log.timestamp}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-[#e0f2f1] rounded-full flex items-center justify-center text-sm">
                                                    {log.user.charAt(0).toUpperCase()}
                                                </div>
                                                <span className="text-sm">{log.user}</span>
                                            </div>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                log.action.toLowerCase().includes('login') ? 'bg-blue-100 text-blue-600' :
                                                log.action.toLowerCase().includes('document') ? 'bg-green-100 text-green-600' :
                                                log.action.toLowerCase().includes('api') ? 'bg-purple-100 text-purple-600' :
                                                log.action.toLowerCase().includes('user') ? 'bg-orange-100 text-orange-600' :
                                                'bg-gray-100 text-gray-600'
                                            }`}>
                                                {log.action}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-xs">{log.resource}</code>
                                        </td>
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                log.result === 'Success' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                                            }`}>
                                                {log.result}
                                            </span>
                                        </td>
                                        <td className="p-4 text-sm font-mono text-gray-600">{log.ip}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {filteredLogs.length === 0 && (
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
