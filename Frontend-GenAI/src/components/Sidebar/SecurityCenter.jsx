import  { useState } from 'react';

const SecurityCenter = () => {
    const [activeTab, setActiveTab] = useState('overview');

    const securityMetrics = {
        threatLevel: 'low',
        lastScan: '2 hours ago',
        vulnerabilities: 2,
        compliantUsers: 94,
        secureDocuments: 1847,
        failedLogins: 3
    };

    const recentActivities = [
        { type: 'login', user: 'S Yathissh', action: 'Successful login', time: '5 min ago', status: 'success' },
        { type: 'document', user: 'Rishi Kumar S', action: 'Accessed confidential document', time: '12 min ago', status: 'warning' },
        { type: 'api', user: 'System', action: 'API key regenerated', time: '1 hour ago', status: 'info' },
        { type: 'failed', user: 'Unknown', action: 'Failed login attempt', time: '2 hours ago', status: 'danger' }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">security</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Security Center</h1>
                                <p className="text-gray-600">Monitor and manage your system security</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-2 px-4 py-2 rounded-full ${
                            securityMetrics.threatLevel === 'low' ? 'bg-green-100 text-green-600' :
                            securityMetrics.threatLevel === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                        }`}>
                            <div className={`w-2 h-2 rounded-full ${
                                securityMetrics.threatLevel === 'low' ? 'bg-green-500' :
                                securityMetrics.threatLevel === 'medium' ? 'bg-yellow-500' :
                                'bg-red-500'
                            }`}></div>
                            <span className="font-semibold">Threat Level: {securityMetrics.threatLevel.toUpperCase()}</span>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        {[
                            { id: 'overview', label: 'Security Overview', icon: 'dashboard' },
                            { id: 'policies', label: 'Security Policies', icon: 'policy' },
                            { id: 'compliance', label: 'Compliance', icon: 'verified' },
                            { id: 'audit', label: 'Audit Trail', icon: 'assignment' }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 ${
                                    activeTab === tab.id
                                        ? 'text-[#00796b] border-b-2 border-[#00796b]'
                                        : 'text-gray-600 hover:text-[#00796b]'
                                }`}
                            >
                                <span className="material-symbols-outlined">{tab.icon}</span>
                                {tab.label}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Security Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="space-y-6">
                        {/* Security Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Active Vulnerabilities</p>
                                        <p className="text-3xl font-bold text-red-600">{securityMetrics.vulnerabilities}</p>
                                        <p className="text-sm text-green-600 mt-1">↓ 3 from last week</p>
                                    </div>
                                    <span className="material-symbols-outlined text-red-600 text-4xl">warning</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Compliant Users</p>
                                        <p className="text-3xl font-bold text-green-600">{securityMetrics.compliantUsers}%</p>
                                        <p className="text-sm text-green-600 mt-1">↑ 2% from last week</p>
                                    </div>
                                    <span className="material-symbols-outlined text-green-600 text-4xl">verified_user</span>
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600">Secure Documents</p>
                                        <p className="text-3xl font-bold text-[#00796b]">{securityMetrics.secureDocuments.toLocaleString()}</p>
                                        <p className="text-sm text-green-600 mt-1">↑ 25 from yesterday</p>
                                    </div>
                                    <span className="material-symbols-outlined text-[#00796b] text-4xl">lock</span>
                                </div>
                            </div>
                        </div>

                        {/* Security Health and Recent Activities */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-[#004d40] mb-6">Security Health</h3>
                                <div className="space-y-6">
                                    {[
                                        { name: 'Password Strength', value: 95, color: 'green' },
                                        { name: 'Two-Factor Authentication', value: 88, color: 'green' },
                                        { name: 'Data Encryption', value: 100, color: 'green' },
                                        { name: 'Access Control', value: 75, color: 'yellow' }
                                    ].map((metric, index) => (
                                        <div key={index}>
                                            <div className="flex justify-between mb-2">
                                                <span>{metric.name}</span>
                                                <span className={`font-semibold ${
                                                    metric.color === 'green' ? 'text-green-600' : 'text-yellow-600'
                                                }`}>{metric.value}%</span>
                                            </div>
                                            <div className="w-full bg-gray-200 rounded-full h-2">
                                                <div 
                                                    className={`h-2 rounded-full ${
                                                        metric.color === 'green' ? 'bg-green-500' : 'bg-yellow-500'
                                                    }`} 
                                                    style={{ width: `${metric.value}%` }}
                                                ></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h3 className="text-xl font-semibold text-[#004d40] mb-6">Recent Security Activities</h3>
                                <div className="space-y-4">
                                    {recentActivities.map((activity, index) => (
                                        <div key={index} className="flex items-center gap-3 p-3 rounded-lg border border-gray-100">
                                            <span className={`material-symbols-outlined p-2 rounded-full ${
                                                activity.status === 'success' ? 'bg-green-100 text-green-600' :
                                                activity.status === 'warning' ? 'bg-yellow-100 text-yellow-600' :
                                                activity.status === 'info' ? 'bg-blue-100 text-blue-600' :
                                                'bg-red-100 text-red-600'
                                            }`}>
                                                {activity.type === 'login' ? 'login' :
                                                 activity.type === 'document' ? 'description' :
                                                 activity.type === 'api' ? 'api' : 'error'}
                                            </span>
                                            <div className="flex-1">
                                                <p className="font-medium text-[#004d40]">{activity.user}</p>
                                                <p className="text-sm text-gray-600">{activity.action}</p>
                                            </div>
                                            <span className="text-sm text-gray-500">{activity.time}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Other tabs content */}
                {activeTab === 'policies' && (
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#004d40] mb-6">Security Policies</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {[
                                { name: 'Password Policy', status: 'active', users: 89, lastUpdated: '2025-01-15' },
                                { name: 'Data Classification', status: 'active', users: 75, lastUpdated: '2025-02-01' },
                                { name: 'Access Control', status: 'review', users: 67, lastUpdated: '2024-12-20' },
                                { name: 'Encryption Standards', status: 'active', users: 89, lastUpdated: '2025-01-10' }
                            ].map((policy, index) => (
                                <div key={index} className="border border-gray-200 rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-4">
                                        <h4 className="text-lg font-semibold text-[#004d40]">{policy.name}</h4>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            policy.status === 'active' ? 'bg-green-100 text-green-600' :
                                            'bg-yellow-100 text-yellow-600'
                                        }`}>
                                            {policy.status.toUpperCase()}
                                        </span>
                                    </div>
                                    <div className="space-y-2 text-sm text-gray-600">
                                        <div className="flex justify-between">
                                            <span>Compliant Users</span>
                                            <span className="font-semibold">{policy.users}/89</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span>Last Updated</span>
                                            <span>{policy.lastUpdated}</span>
                                        </div>
                                    </div>
                                    <div className="mt-4 flex gap-2">
                                        <button className="flex-1 bg-[#00796b] text-white py-2 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                            View Details
                                        </button>
                                        <button className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            Edit
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Add other tab contents as needed */}
            </div>
        </div>
    );
};

export default SecurityCenter;
