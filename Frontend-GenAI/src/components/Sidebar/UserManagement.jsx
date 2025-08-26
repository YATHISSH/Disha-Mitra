import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const UserManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRole, setSelectedRole] = useState('all');

    // Define roles array
    const roles = [
        {
            name: 'Admin',
            color: 'red',
            count: 2,
            permissions: [
                'Full system access',
                'User management',
                'System configuration',
                'Security controls',
                'Data export/import'
            ]
        },
        {
            name: 'Editor',
            color: 'blue',
            count: 2,
            permissions: [
                'Content management',
                'Document editing',
                'File uploads',
                'Team collaboration',
                'Analytics viewing'
            ]
        },
        {
            name: 'Viewer',
            color: 'green',
            count: 2,
            permissions: [
                'View content',
                'Download files',
                'Basic analytics',
                'Profile management'
            ]
        }
    ];

    const users = [
        { id: 1, name: 'S Yathissh', email: 's.yathissh@company.com', role: 'Admin', status: 'active', lastLogin: '2025-02-26 10:00:00', avatar: '👤' },
        { id: 2, name: 'Rishi Kumar S', email: 'rishi.kumar.s@company.com', role: 'Editor', status: 'active', lastLogin: '2025-02-26 09:45:00', avatar: '👤' },
        { id: 3, name: 'Sachin A', email: 'sachin.a@company.com', role: 'Viewer', status: 'inactive', lastLogin: '2025-02-24 15:30:00', avatar: '👤' },
        { id: 4, name: 'Jashvarthini R', email: 'jashvarthini.r@company.com', role: 'Editor', status: 'active', lastLogin: '2025-02-26 11:00:00', avatar: '👤' },
        { id: 5, name: 'N J Meenakshi', email: 'nj.meenakshi@company.com', role: 'Viewer', status: 'active', lastLogin: '2025-02-25 18:00:00', avatar: '👤' },
        { id: 6, name: 'Sundara Vinayayagam V', email: 'sundara.vinayayagam.v@company.com', role: 'Admin', status: 'invited', lastLogin: null, avatar: '👤' }
    ];

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = selectedRole === 'all' || user.role.toLowerCase() === selectedRole.toLowerCase();
        return matchesSearch && matchesRole;
    });

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
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#f6c636] text-3xl">manage_accounts</span>
                        <div>
                            <h1 className="text-3xl font-bold text-[#f6c636] font-verdana">User Management</h1>
                            <p className="text-gray-400">Manage users, roles, and permissions</p>
                        </div>
                    </div>
                </div>
                <button className="bg-[#197e71] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#27719e] transition-colors duration-200 flex items-center gap-2">
                    <span className="material-symbols-outlined">person_add</span>
                    Add User
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Tab Navigation */}
                <div className="bg-[#2a2f33] rounded-lg shadow-lg mb-6">
                    <div className="flex border-b border-gray-600">
                        {[
                            { id: 'users', label: 'Users', count: users.length },
                            { id: 'roles', label: 'Roles & Permissions', count: roles.length },
                            { id: 'activity', label: 'User Activity', count: null }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors duration-200 ${
                                    activeTab === tab.id
                                        ? 'text-[#f6c636] border-b-2 border-[#f6c636]'
                                        : 'text-gray-400 hover:text-[#f6c636]'
                                }`}
                            >
                                {tab.label}
                                {tab.count !== null && (
                                    <span className={`px-2 py-1 rounded-full text-xs ${
                                        activeTab === tab.id ? 'bg-[#f6c636] text-black' : 'bg-gray-600 text-gray-300'
                                    }`}>
                                        {tab.count}
                                    </span>
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <>
                        {/* Search and Filter */}
                        <div className="bg-[#2a2f33] rounded-lg shadow-lg p-6 mb-6">
                            <div className="flex gap-4">
                                <div className="relative flex-1">
                                    <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                        search
                                    </span>
                                    <input
                                        type="text"
                                        placeholder="Search users by name or email..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full pl-12 pr-4 py-3 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5] focus:border-transparent"
                                    />
                                </div>
                                <select 
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="bg-[#1c1e1f] text-white border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                >
                                    <option value="all">All Roles</option>
                                    {roles.map(role => (
                                        <option key={role.name} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        {/* Users List */}
                        <div className="bg-[#2a2f33] rounded-lg shadow-lg overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead className="bg-[#1c1e1f]">
                                        <tr>
                                            <th className="text-left p-4 font-semibold text-[#f6c636]">User</th>
                                            <th className="text-left p-4 font-semibold text-[#f6c636]">Role</th>
                                            <th className="text-left p-4 font-semibold text-[#f6c636]">Status</th>
                                            <th className="text-left p-4 font-semibold text-[#f6c636]">Last Login</th>
                                            <th className="text-right p-4 font-semibold text-[#f6c636]">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredUsers.map(user => (
                                            <tr key={user.id} className="border-t border-gray-600 hover:bg-[#1c1e1f]">
                                                <td className="p-4">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-[#508ec5] rounded-full flex items-center justify-center text-white font-bold">
                                                            {user.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <div className="font-medium text-white">{user.name}</div>
                                                            <div className="text-sm text-gray-400">{user.email}</div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        user.role === 'Admin' ? 'bg-red-100 text-red-600' :
                                                        user.role === 'Editor' ? 'bg-blue-100 text-blue-600' :
                                                        user.role === 'Viewer' ? 'bg-green-100 text-green-600' :
                                                        'bg-gray-100 text-gray-600'
                                                    }`}>
                                                        {user.role}
                                                    </span>
                                                </td>
                                                <td className="p-4">
                                                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                        user.status === 'active' ? 'bg-green-100 text-green-600' :
                                                        user.status === 'inactive' ? 'bg-gray-100 text-gray-600' :
                                                        'bg-yellow-100 text-yellow-600'
                                                    }`}>
                                                        {user.status}
                                                    </span>
                                                </td>
                                                <td className="p-4 text-sm text-gray-400">{user.lastLogin || 'Never'}</td>
                                                <td className="p-4">
                                                    <div className="flex justify-end gap-2">
                                                        <button className="p-2 text-gray-400 hover:text-[#508ec5] hover:bg-gray-700 rounded-lg">
                                                            <span className="material-symbols-outlined">edit</span>
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-blue-400 hover:bg-blue-900/20 rounded-lg">
                                                            <span className="material-symbols-outlined">mail</span>
                                                        </button>
                                                        <button className="p-2 text-gray-400 hover:text-red-400 hover:bg-red-900/20 rounded-lg">
                                                            <span className="material-symbols-outlined">delete</span>
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </>
                )}

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {roles.map(role => (
                                <div key={role.name} className="bg-[#2a2f33] rounded-lg shadow-lg p-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-3 h-3 rounded-full ${
                                                role.color === 'red' ? 'bg-red-500' :
                                                role.color === 'blue' ? 'bg-blue-500' :
                                                'bg-green-500'
                                            }`}></div>
                                            <h3 className="text-lg font-semibold text-[#f6c636]">{role.name}</h3>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <span className="text-sm text-gray-400">{role.count} users</span>
                                            <button className="p-1 text-gray-400 hover:text-[#508ec5]">
                                                <span className="material-symbols-outlined">edit</span>
                                            </button>
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-sm font-semibold text-gray-400">PERMISSIONS</h4>
                                        {role.permissions.map((permission, index) => (
                                            <div key={index} className="flex items-center gap-2 text-sm">
                                                <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                                                <span className="text-gray-300">{permission}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* User Activity Tab */}
                {activeTab === 'activity' && (
                    <div className="bg-[#2a2f33] rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#f6c636] mb-6">Recent User Activity</h3>
                        <div className="space-y-4">
                            {[
                                { user: 'S Yathissh', action: 'Logged in to the system', time: '5 minutes ago', type: 'login' },
                                { user: 'Rishi Kumar S', action: 'Updated user permissions', time: '15 minutes ago', type: 'admin' },
                                { user: 'Sachin A', action: 'Downloaded security document', time: '1 hour ago', type: 'download' },
                                { user: 'Jashvarthini R', action: 'Failed login attempt', time: '2 hours ago', type: 'error' }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 border border-gray-600 rounded-lg">
                                    <span className={`material-symbols-outlined p-2 rounded-full ${
                                        activity.type === 'login' ? 'bg-green-900/20 text-green-400' :
                                        activity.type === 'admin' ? 'bg-blue-900/20 text-blue-400' :
                                        activity.type === 'download' ? 'bg-yellow-900/20 text-yellow-400' :
                                        'bg-red-900/20 text-red-400'
                                    }`}>
                                        {activity.type === 'login' ? 'login' :
                                         activity.type === 'admin' ? 'admin_panel_settings' :
                                         activity.type === 'download' ? 'download' : 'error'}
                                    </span>
                                    <div className="flex-1">
                                        <p className="font-medium text-white">{activity.user}</p>
                                        <p className="text-sm text-gray-400">{activity.action}</p>
                                    </div>
                                    <span className="text-sm text-gray-500">{activity.time}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserManagement;
