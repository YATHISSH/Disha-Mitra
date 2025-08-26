import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';


const Settings = () => {
    const navigate = useNavigate();
    
    // State for different settings sections
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        // General Settings
        theme: 'dark',
        language: 'en',
        timezone: 'UTC',
        autoSave: true,
        notifications: true,
        
        // Security Settings
        twoFactorAuth: false,
        sessionTimeout: '30',
        loginAlerts: true,
        
        // Privacy Settings
        dataCollection: true,
        analytics: false,
        shareData: false,
        
        // Integration Settings
        apiAccess: false,
        webhooks: false,
        
        // Performance Settings
        cacheEnabled: true,
        compressionEnabled: true,
        loadBalancing: false
    });

    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Load settings from localStorage or API
    useEffect(() => {
        const savedSettings = localStorage.getItem('appSettings');
        if (savedSettings) {
            setSettings(prev => ({ ...prev, ...JSON.parse(savedSettings) }));
        }
    }, []);

    const handleInputChange = (key, value) => {
        setSettings(prev => ({
            ...prev,
            [key]: value
        }));
    };

    const handleSave = async () => {
        setIsLoading(true);
        try {
            // Save to localStorage (you can replace this with API call)
            localStorage.setItem('appSettings', JSON.stringify(settings));
            
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setMessage({ type: 'success', text: 'Settings saved successfully!' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
            setTimeout(() => setMessage({ type: '', text: '' }), 3000);
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setSettings({
            theme: 'dark',
            language: 'en',
            timezone: 'UTC',
            autoSave: true,
            notifications: true,
            twoFactorAuth: false,
            sessionTimeout: '30',
            loginAlerts: true,
            dataCollection: true,
            analytics: false,
            shareData: false,
            apiAccess: false,
            webhooks: false,
            cacheEnabled: true,
            compressionEnabled: true,
            loadBalancing: false
        });
        setMessage({ type: 'info', text: 'Settings reset to defaults.' });
        setTimeout(() => setMessage({ type: '', text: '' }), 3000);
    };

    const tabs = [
        { id: 'general', name: 'General', icon: 'settings' },
        { id: 'security', name: 'Security', icon: 'security' },
        { id: 'privacy', name: 'Privacy', icon: 'privacy_tip' },
        { id: 'integrations', name: 'Integrations', icon: 'hub' },
        { id: 'performance', name: 'Performance', icon: 'speed' }
    ];

    const renderGeneralSettings = () => (
        <div className="space-y-6">
            <h3 className="text-[#f6c636] font-semibold text-lg">General Settings</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="block text-white font-medium mb-2">Theme</label>
                    <select 
                        value={settings.theme}
                        onChange={(e) => handleInputChange('theme', e.target.value)}
                        className="w-full p-3 bg-[#2a2f33] text-white rounded-lg border border-gray-600 focus:border-[#508ec5] focus:outline-none"
                    >
                        <option value="dark">Dark</option>
                        <option value="light">Light</option>
                        <option value="auto">Auto</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white font-medium mb-2">Language</label>
                    <select 
                        value={settings.language}
                        onChange={(e) => handleInputChange('language', e.target.value)}
                        className="w-full p-3 bg-[#2a2f33] text-white rounded-lg border border-gray-600 focus:border-[#508ec5] focus:outline-none"
                    >
                        <option value="en">English</option>
                        <option value="es">Spanish</option>
                        <option value="fr">French</option>
                        <option value="de">German</option>
                    </select>
                </div>

                <div>
                    <label className="block text-white font-medium mb-2">Timezone</label>
                    <select 
                        value={settings.timezone}
                        onChange={(e) => handleInputChange('timezone', e.target.value)}
                        className="w-full p-3 bg-[#2a2f33] text-white rounded-lg border border-gray-600 focus:border-[#508ec5] focus:outline-none"
                    >
                        <option value="UTC">UTC</option>
                        <option value="America/New_York">Eastern Time</option>
                        <option value="America/Los_Angeles">Pacific Time</option>
                        <option value="Europe/London">London</option>
                        <option value="Asia/Tokyo">Tokyo</option>
                    </select>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Auto Save</h4>
                        <p className="text-gray-400 text-sm">Automatically save your work</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.autoSave}
                            onChange={(e) => handleInputChange('autoSave', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Notifications</h4>
                        <p className="text-gray-400 text-sm">Receive system notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.notifications}
                            onChange={(e) => handleInputChange('notifications', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderSecuritySettings = () => (
        <div className="space-y-6">
            <h3 className="text-[#f6c636] font-semibold text-lg">Security Settings</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Two-Factor Authentication</h4>
                        <p className="text-gray-400 text-sm">Add an extra layer of security</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.twoFactorAuth}
                            onChange={(e) => handleInputChange('twoFactorAuth', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div>
                    <label className="block text-white font-medium mb-2">Session Timeout (minutes)</label>
                    <input 
                        type="number"
                        value={settings.sessionTimeout}
                        onChange={(e) => handleInputChange('sessionTimeout', e.target.value)}
                        className="w-full p-3 bg-[#2a2f33] text-white rounded-lg border border-gray-600 focus:border-[#508ec5] focus:outline-none"
                        min="5"
                        max="480"
                    />
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Login Alerts</h4>
                        <p className="text-gray-400 text-sm">Get notified of new login attempts</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.loginAlerts}
                            onChange={(e) => handleInputChange('loginAlerts', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderPrivacySettings = () => (
        <div className="space-y-6">
            <h3 className="text-[#f6c636] font-semibold text-lg">Privacy Settings</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Data Collection</h4>
                        <p className="text-gray-400 text-sm">Allow collection of usage data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.dataCollection}
                            onChange={(e) => handleInputChange('dataCollection', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Analytics</h4>
                        <p className="text-gray-400 text-sm">Share anonymous analytics data</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.analytics}
                            onChange={(e) => handleInputChange('analytics', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Share Data</h4>
                        <p className="text-gray-400 text-sm">Allow data sharing with partners</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.shareData}
                            onChange={(e) => handleInputChange('shareData', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderIntegrationSettings = () => (
        <div className="space-y-6">
            <h3 className="text-[#f6c636] font-semibold text-lg">Integration Settings</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">API Access</h4>
                        <p className="text-gray-400 text-sm">Enable API access for integrations</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.apiAccess}
                            onChange={(e) => handleInputChange('apiAccess', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Webhooks</h4>
                        <p className="text-gray-400 text-sm">Allow webhook notifications</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.webhooks}
                            onChange={(e) => handleInputChange('webhooks', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderPerformanceSettings = () => (
        <div className="space-y-6">
            <h3 className="text-[#f6c636] font-semibold text-lg">Performance Settings</h3>
            
            <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Cache Enabled</h4>
                        <p className="text-gray-400 text-sm">Enable caching for better performance</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.cacheEnabled}
                            onChange={(e) => handleInputChange('cacheEnabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Compression</h4>
                        <p className="text-gray-400 text-sm">Enable data compression</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.compressionEnabled}
                            onChange={(e) => handleInputChange('compressionEnabled', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>

                <div className="flex items-center justify-between p-4 bg-[#2a2f33] rounded-lg">
                    <div>
                        <h4 className="text-white font-medium">Load Balancing</h4>
                        <p className="text-gray-400 text-sm">Enable load balancing (Enterprise only)</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                            type="checkbox" 
                            checked={settings.loadBalancing}
                            onChange={(e) => handleInputChange('loadBalancing', e.target.checked)}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#508ec5] rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#508ec5]"></div>
                    </label>
                </div>
            </div>
        </div>
    );

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return renderGeneralSettings();
            case 'security':
                return renderSecuritySettings();
            case 'privacy':
                return renderPrivacySettings();
            case 'integrations':
                return renderIntegrationSettings();
            case 'performance':
                return renderPerformanceSettings();
            default:
                return renderGeneralSettings();
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] text-white font-verdana">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-700">
                <div className="flex items-center gap-4">
                    <button 
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-[#508ec5] hover:text-white transition-colors"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        <span>Back</span>
                    </button>
                    <h1 className="text-2xl font-bold text-[#f6c636]">System Settings</h1>
                </div>
                
                {/* Message Display */}
                {message.text && (
                    <div className={`px-4 py-2 rounded-lg text-sm ${
                        message.type === 'success' ? 'bg-green-600 text-white' :
                        message.type === 'error' ? 'bg-red-600 text-white' :
                        'bg-blue-600 text-white'
                    }`}>
                        {message.text}
                    </div>
                )}
            </div>

            <div className="flex">
                {/* Sidebar Tabs */}
                <div className="w-64 min-h-screen bg-[#2a2f33] p-4">
                    <div className="space-y-2">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                    activeTab === tab.id 
                                        ? 'bg-[#508ec5] text-white' 
                                        : 'text-gray-300 hover:bg-[#1c1e1f] hover:text-white'
                                }`}
                            >
                                <span className="material-symbols-outlined text-[20px]">
                                    {tab.icon}
                                </span>
                                {tab.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex-1 p-6">
                    <div className="max-w-4xl mx-auto">
                        {renderTabContent()}
                        
                        {/* Action Buttons */}
                        <div className="flex gap-4 mt-8 pt-6 border-t border-gray-700">
                            <button
                                onClick={handleSave}
                                disabled={isLoading}
                                className="flex items-center gap-2 px-6 py-3 bg-[#197e71] hover:bg-[#27719e] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <>
                                        <span className="material-symbols-outlined animate-spin text-[20px]">refresh</span>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <span className="material-symbols-outlined text-[20px]">save</span>
                                        Save Settings
                                    </>
                                )}
                            </button>
                            
                            <button
                                onClick={handleReset}
                                className="flex items-center gap-2 px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium transition-colors"
                            >
                                <span className="material-symbols-outlined text-[20px]">refresh</span>
                                Reset to Defaults
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
