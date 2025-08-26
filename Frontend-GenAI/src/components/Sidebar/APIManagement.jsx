// import  { useState } from 'react';

const APIManagement = () => {
    // const [activeTab, setActiveTab] = useState('overview');
    // const [showCreateModal, setShowCreateModal] = useState(false);

    const apiKeys = [
        { id: 1, name: 'Production API Key', key: 'vnt_prod_**********************', status: 'active', requests: 12458, lastUsed: '2 minutes ago' },
        { id: 2, name: 'Development API Key', key: 'vnt_dev_**********************', status: 'active', requests: 3247, lastUsed: '1 hour ago' },
        { id: 3, name: 'Testing API Key', key: 'vnt_test_**********************', status: 'inactive', requests: 856, lastUsed: '2 days ago' }
    ];

    const endpoints = [
        { method: 'POST', path: '/api/chat', description: 'Send chat message', requests: 8945, avgTime: '120ms', status: 'healthy' },
        { method: 'GET', path: '/api/documents', description: 'List documents', requests: 2341, avgTime: '85ms', status: 'healthy' },
        { method: 'POST', path: '/api/upload', description: 'Upload document', requests: 1167, avgTime: '450ms', status: 'warning' },
        { method: 'GET', path: '/api/analytics', description: 'Get analytics data', requests: 567, avgTime: '200ms', status: 'healthy' }
    ];

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
                        <button 
                        
                            // onClick={() => setShowCreateModal(true)}
                            className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004d40] transition-colors duration-200 flex items-center gap-2"
                        >
                            <span className="material-symbols-outlined">add</span>
                            Create API Key
                        </button>
                    </div>
                </div>

                {/* API Statistics */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Requests</p>
                                <p className="text-3xl font-bold text-[#00796b]">12,458</p>
                                <p className="text-sm text-green-600 mt-1">↑ 12% from last week</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">trending_up</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Success Rate</p>
                                <p className="text-3xl font-bold text-green-600">99.8%</p>
                                <p className="text-sm text-green-600 mt-1">↑ 0.2% from last week</p>
                            </div>
                            <span className="material-symbols-outlined text-green-600 text-4xl">check_circle</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Response Time</p>
                                <p className="text-3xl font-bold text-[#00796b]">145ms</p>
                                <p className="text-sm text-red-600 mt-1">↑ 15ms from last week</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">speed</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Keys</p>
                                <p className="text-3xl font-bold text-[#00796b]">{apiKeys.filter(k => k.status === 'active').length}</p>
                                <p className="text-sm text-gray-600 mt-1">out of {apiKeys.length} total</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">vpn_key</span>
                        </div>
                    </div>
                </div>

                {/* API Keys Section */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <h3 className="text-xl font-semibold text-[#004d40] mb-6">API Keys</h3>
                    <div className="space-y-4">
                        {apiKeys.map(key => (
                            <div key={key.id} className="border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <h4 className="font-semibold text-[#004d40]">{key.name}</h4>
                                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                key.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                            }`}>
                                                {key.status.toUpperCase()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-4 text-sm text-gray-600">
                                            <code className="bg-gray-100 px-2 py-1 rounded">{key.key}</code>
                                            <span>{key.requests.toLocaleString()} requests</span>
                                            <span>Last used: {key.lastUsed}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg">
                                            <span className="material-symbols-outlined">content_copy</span>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-yellow-600 hover:bg-yellow-50 rounded-lg">
                                            <span className="material-symbols-outlined">refresh</span>
                                        </button>
                                        <button className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-lg">
                                            <span className="material-symbols-outlined">delete</span>
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Endpoints Section */}
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-[#004d40] mb-6">API Endpoints</h3>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Method</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Endpoint</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Description</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Requests</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Avg Time</th>
                                    <th className="text-left p-4 font-semibold text-[#004d40]">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {endpoints.map((endpoint, index) => (
                                    <tr key={index} className="border-t hover:bg-gray-50">
                                        <td className="p-4">
                                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                                                endpoint.method === 'GET' ? 'bg-blue-100 text-blue-600' :
                                                endpoint.method === 'POST' ? 'bg-green-100 text-green-600' :
                                                endpoint.method === 'PUT' ? 'bg-yellow-100 text-yellow-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {endpoint.method}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <code className="bg-gray-100 px-2 py-1 rounded text-sm">{endpoint.path}</code>
                                        </td>
                                        <td className="p-4 text-gray-600">{endpoint.description}</td>
                                        <td className="p-4">{endpoint.requests.toLocaleString()}</td>
                                        <td className="p-4">{endpoint.avgTime}</td>
                                        <td className="p-4">
                                            <span className={`flex items-center gap-1 ${
                                                endpoint.status === 'healthy' ? 'text-green-600' : 'text-yellow-600'
                                            }`}>
                                                <div className={`w-2 h-2 rounded-full ${
                                                    endpoint.status === 'healthy' ? 'bg-green-500' : 'bg-yellow-500'
                                                }`}></div>
                                                {endpoint.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default APIManagement;
