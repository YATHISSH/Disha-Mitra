import  { useState } from 'react';

const IntegrationHub = () => {
    const [activeTab, setActiveTab] = useState('available');
    const [searchTerm, setSearchTerm] = useState('');

    const availableIntegrations = [
        {
            id: 1,
            name: 'Microsoft Teams',
            description: 'Connect with your team collaboration platform',
            icon: '💬',
            category: 'Communication',
            status: 'available',
            features: ['Real-time notifications', 'File sharing', 'Bot integration'],
            popularity: 95
        },
        {
            id: 2,
            name: 'Slack',
            description: 'Integrate with Slack for seamless team communication',
            icon: '📱',
            category: 'Communication',
            status: 'available',
            features: ['Channel notifications', 'Direct messages', 'Workflow automation'],
            popularity: 88
        },
        {
            id: 3,
            name: 'Google Drive',
            description: 'Access and manage documents from Google Drive',
            icon: '📁',
            category: 'Storage',
            status: 'available',
            features: ['File sync', 'Document preview', 'Version control'],
            popularity: 92
        },
        {
            id: 4,
            name: 'SharePoint',
            description: 'Microsoft SharePoint document management',
            icon: '📊',
            category: 'Storage',
            status: 'available',
            features: ['Document libraries', 'Metadata extraction', 'Permission management'],
            popularity: 75
        },
        {
            id: 5,
            name: 'Jira',
            description: 'Project management and issue tracking',
            icon: '🎯',
            category: 'Productivity',
            status: 'available',
            features: ['Issue tracking', 'Project updates', 'Sprint planning'],
            popularity: 82
        }
    ];

    const connectedIntegrations = [
        {
            id: 1,
            name: 'Microsoft Teams',
            status: 'connected',
            lastSync: '2 minutes ago',
            health: 'excellent',
            dataSync: 1250,
            icon: '💬'
        },
        {
            id: 2,
            name: 'Google Drive',
            status: 'connected',
            lastSync: '5 minutes ago',
            health: 'good',
            dataSync: 847,
            icon: '📁'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">hub</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Integration Hub</h1>
                                <p className="text-gray-600">Connect with your favorite tools and services</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <button className="border border-[#00796b] text-[#00796b] px-6 py-3 rounded-lg font-semibold hover:bg-[#00796b] hover:text-white transition-colors duration-200">
                                View Documentation
                            </button>
                            <button className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004d40] transition-colors duration-200">
                                Custom Integration
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        {[
                            { id: 'available', label: 'Available Integrations', count: availableIntegrations.length },
                            { id: 'connected', label: 'Connected', count: connectedIntegrations.length },
                            { id: 'api', label: 'API Management', count: null }
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
                                {tab.label}
                                {tab.count !== null && (
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        activeTab === tab.id ? 'bg-[#00796b] text-white' : 'bg-gray-200 text-gray-600'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Available Integrations Tab */}
                {activeTab === 'available' && (
                    <>
                        {/* Search and Filter */}
                        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        search
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search integrations..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:border-transparent"
                                    />
                                </div>
                                <select className="border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#00796b]">
                                    <option>All Categories</option>
                                    <option>Communication</option>
                                    <option>Storage</option>
                                    <option>Productivity</option>
                                </select>
                            </div>
                        </div>

                        {/* Integration Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {availableIntegrations
                                .filter(integration => 
                                    integration.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                                    integration.description.toLowerCase().includes(searchTerm.toLowerCase())
                                )
                                .map(integration => (
                                <div key={integration.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-[#e0f2f1] rounded-lg flex items-center justify-center text-2xl">
                                                {integration.icon}
                                            </div>
                                            <div>
                                                <h3 className="text-lg font-semibold text-[#004d40]">{integration.name}</h3>
                                                <span className="text-sm text-gray-500">{integration.category}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-yellow-500 text-sm">star</span>
                                            <span className="text-sm font-medium">{integration.popularity}%</span>
                                        </div>
                                    </div>
                                    
                                    <p className="text-gray-600 mb-4">{integration.description}</p>
                                    
                                    <div className="mb-4">
                                        <h4 className="text-sm font-semibold text-[#004d40] mb-2">Key Features:</h4>
                                        <ul className="space-y-1">
                                            {integration.features.map((feature, index) => (
                                                <li key={index} className="text-sm text-gray-600 flex items-center gap-2">
                                                    <span className="material-symbols-outlined text-green-500 text-xs">check_circle</span>
                                                    {feature}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        <button className="flex-1 bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                            Connect
                                        </button>
                                        <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                            <span className="material-symbols-outlined">info</span>
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}

                {/* Connected Integrations Tab */}
                {activeTab === 'connected' && (
                    <div className="space-y-6">
                        {connectedIntegrations.map(integration => (
                            <div key={integration.id} className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-[#e0f2f1] rounded-lg flex items-center justify-center text-2xl">
                                            {integration.icon}
                                        </div>
                                        <div>
                                            <h3 className="text-lg font-semibold text-[#004d40]">{integration.name}</h3>
                                            <div className="flex items-center gap-4 text-sm text-gray-600">
                                                <span className="flex items-center gap-1">
                                                    <div className={`w-2 h-2 rounded-full ${
                                                        integration.health === 'excellent' ? 'bg-green-500' :
                                                        integration.health === 'good' ? 'bg-yellow-500' : 'bg-red-500'
                                                    }`}></div>
                                                    {integration.health} health
                                                </span>
                                                <span>Last sync: {integration.lastSync}</span>
                                                <span>{integration.dataSync} records synced</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button className="border border-gray-300 text-gray-600 py-2 px-4 rounded-lg hover:bg-gray-50 transition-colors duration-200">
                                            Configure
                                        </button>
                                        <button className="border border-red-300 text-red-600 py-2 px-4 rounded-lg hover:bg-red-50 transition-colors duration-200">
                                            Disconnect
                                        </button>
                                        <button className="bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                            Sync Now
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                        
                        {connectedIntegrations.length === 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">link_off</span>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No connected integrations</h3>
                                <p className="text-gray-500 mb-4">Connect with your favorite tools to get started.</p>
                                <button 
                                    onClick={() => setActiveTab('available')}
                                    className="bg-[#00796b] text-white px-6 py-3 rounded-lg hover:bg-[#004d40] transition-colors duration-200"
                                >
                                    Browse Integrations
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* API Management Tab */}
                {activeTab === 'api' && (
                    <div className="space-y-6">
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-semibold text-[#004d40]">API Keys & Access</h3>
                                <button className="bg-[#00796b] text-white px-6 py-3 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                    Generate New Key
                                </button>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-[#004d40] mb-2">Production API Key</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">vnt_prod_**********************</code>
                                        <button className="text-[#00796b] hover:text-[#004d40]">
                                            <span className="material-symbols-outlined">content_copy</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">Last used: 5 minutes ago</p>
                                    <div className="mt-4 flex gap-2">
                                        <button className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                                            Regenerate
                                        </button>
                                        <button className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50">
                                            Revoke
                                        </button>
                                    </div>
                                </div>
                                
                                <div className="border border-gray-200 rounded-lg p-4">
                                    <h4 className="font-semibold text-[#004d40] mb-2">Development API Key</h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        <code className="bg-gray-100 px-2 py-1 rounded text-sm">vnt_dev_**********************</code>
                                        <button className="text-[#00796b] hover:text-[#004d40]">
                                            <span className="material-symbols-outlined">content_copy</span>
                                        </button>
                                    </div>
                                    <p className="text-sm text-gray-600">Last used: 2 hours ago</p>
                                    <div className="mt-4 flex gap-2">
                                        <button className="text-sm border border-gray-300 px-3 py-1 rounded hover:bg-gray-50">
                                            Regenerate
                                        </button>
                                        <button className="text-sm border border-red-300 text-red-600 px-3 py-1 rounded hover:bg-red-50">
                                            Revoke
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-lg p-6">
                            <h3 className="text-xl font-semibold text-[#004d40] mb-6">API Usage Statistics</h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00796b]">12,458</div>
                                    <div className="text-sm text-gray-600">Total Requests</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00796b]">99.8%</div>
                                    <div className="text-sm text-gray-600">Success Rate</div>
                                </div>
                                <div className="text-center">
                                    <div className="text-3xl font-bold text-[#00796b]">145ms</div>
                                    <div className="text-sm text-gray-600">Avg Response Time</div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default IntegrationHub;
