import  { useState } from 'react';

const AnalyticsHub = () => {
    const [timeRange, setTimeRange] = useState('7days');
    const [analyticsData, ] = useState({
        totalQueries: 1250,
        activeUsers: 89,
        documentViews: 2340,
        avgResponseTime: 1.2,
        topCategories: [
            { name: 'Policies', queries: 450, percentage: 36 },
            { name: 'Technical', queries: 320, percentage: 26 },
            { name: 'Training', queries: 280, percentage: 22 },
            { name: 'Compliance', queries: 200, percentage: 16 }
        ]
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">analytics</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Analytics Hub</h1>
                                <p className="text-gray-600">Monitor system performance and user engagement</p>
                            </div>
                        </div>
                        <select
                            value={timeRange}
                            onChange={(e) => setTimeRange(e.target.value)}
                            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                        >
                            <option value="7days">Last 7 Days</option>
                            <option value="30days">Last 30 Days</option>
                            <option value="90days">Last 90 Days</option>
                        </select>
                    </div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Queries</p>
                                <p className="text-3xl font-bold text-[#00796b]">{analyticsData.totalQueries.toLocaleString()}</p>
                                <p className="text-sm text-green-600 mt-1">↑ 12% from last period</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">chat</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Active Users</p>
                                <p className="text-3xl font-bold text-[#00796b]">{analyticsData.activeUsers}</p>
                                <p className="text-sm text-green-600 mt-1">↑ 8% from last period</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">people</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Document Views</p>
                                <p className="text-3xl font-bold text-[#00796b]">{analyticsData.documentViews.toLocaleString()}</p>
                                <p className="text-sm text-green-600 mt-1">↑ 15% from last period</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">visibility</span>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Avg Response Time</p>
                                <p className="text-3xl font-bold text-[#00796b]">{analyticsData.avgResponseTime}s</p>
                                <p className="text-sm text-red-600 mt-1">↑ 0.2s from last period</p>
                            </div>
                            <span className="material-symbols-outlined text-[#00796b] text-4xl">speed</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Query Categories Chart */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#004d40] mb-6">Popular Query Categories</h3>
                        <div className="space-y-4">
                            {analyticsData.topCategories.map((category, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-3 h-3 rounded-full ${
                                            index === 0 ? 'bg-[#00796b]' :
                                            index === 1 ? 'bg-[#0097a7]' :
                                            index === 2 ? 'bg-[#00acc1]' : 'bg-[#26c6da]'
                                        }`}></div>
                                        <span className="font-medium">{category.name}</span>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-bold text-[#004d40]">{category.queries}</p>
                                        <p className="text-sm text-gray-500">{category.percentage}%</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* System Health */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#004d40] mb-6">System Health</h3>
                        <div className="space-y-6">
                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Server Performance</span>
                                    <span className="text-green-600 font-semibold">95%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Database Health</span>
                                    <span className="text-green-600 font-semibold">98%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-green-500 h-2 rounded-full" style={{ width: '98%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>API Response Rate</span>
                                    <span className="text-yellow-600 font-semibold">87%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '87%' }}></div>
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between mb-2">
                                    <span>Storage Utilization</span>
                                    <span className="text-red-600 font-semibold">78%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2">
                                    <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="mt-6 bg-white rounded-lg shadow-lg p-6">
                    <h3 className="text-xl font-semibold text-[#004d40] mb-6">Recent Activity</h3>
                    <div className="space-y-4">
                        {[
                            { user: 'S Yathissh', action: 'Uploaded new policy document', time: '2 minutes ago', type: 'upload' },
                            { user: 'Rishi Kumar S', action: 'Queried compliance guidelines', time: '5 minutes ago', type: 'query' },
                            { user: 'Sachin A', action: 'Accessed training materials', time: '10 minutes ago', type: 'view' },
                            { user: 'Jashvarthini R', action: 'Updated security protocols', time: '15 minutes ago', type: 'edit' }
                        ].map((activity, index) => (
                            <div key={index} className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg">
                                <span className={`material-symbols-outlined p-2 rounded-full ${
                                    activity.type === 'upload' ? 'bg-green-100 text-green-600' :
                                    activity.type === 'query' ? 'bg-blue-100 text-blue-600' :
                                    activity.type === 'view' ? 'bg-yellow-100 text-yellow-600' :
                                    'bg-purple-100 text-purple-600'
                                }`}>
                                    {activity.type === 'upload' ? 'upload' :
                                     activity.type === 'query' ? 'search' :
                                     activity.type === 'view' ? 'visibility' : 'edit'}
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
    );
};

export default AnalyticsHub;
