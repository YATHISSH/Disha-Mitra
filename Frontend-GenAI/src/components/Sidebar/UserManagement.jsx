import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createUser, listUsersByCompany, createRole, listRolesByCompany } from '../../api';

const UserManagement = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('users');
    const [searchTerm, setSearchTerm] = useState('');
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showAddUserModal, setShowAddUserModal] = useState(false);
    const [formError, setFormError] = useState('');
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'Viewer'
    });

    // Role management state
    const [roles, setRoles] = useState([]);
    const [rolesLoading, setRolesLoading] = useState(false);
    const [showAddRoleModal, setShowAddRoleModal] = useState(false);
    const [roleFormError, setRoleFormError] = useState('');
    const [roleFormData, setRoleFormData] = useState({
        name: '',
        description: '',
        permissions: [],
        color: 'blue'
    });
    const [selectedPermissions, setSelectedPermissions] = useState([]);

    // Get company ID from localStorage (set during signup/login)
    const companyId = localStorage.getItem('companyId') || 1;

    // Define available permissions
    const availablePermissions = [
        'Full system access',
        'User management',
        'System configuration',
        'Security controls',
        'Data export/import',
        'Content management',
        'Document editing',
        'File uploads',
        'Team collaboration',
        'Analytics viewing',
        'View content',
        'Download files',
        'Basic analytics',
        'Profile management'
    ];
        

    // Fetch users on component mount
    useEffect(() => {
        fetchUsers();
        fetchRoles();
    }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        try {
            const fetchedUsers = await listUsersByCompany(companyId);
            setUsers(fetchedUsers);
            setFormError('');
        } catch (error) {
            console.error('Error fetching users:', error);
            setFormError('Failed to load users');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddUser = async (e) => {
        e.preventDefault();
        setFormError('');

        // Validation
        if (!formData.name || !formData.email || !formData.password) {
            setFormError('Please fill all required fields');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setFormError('Passwords do not match');
            return;
        }

        if (formData.password.length < 6) {
            setFormError('Password must be at least 6 characters');
            return;
        }

        try {
            await createUser(companyId, formData.name, formData.email, formData.password, formData.role);
            setFormData({
                name: '',
                email: '',
                password: '',
                confirmPassword: '',
                role: 'Viewer'
            });
            setShowAddUserModal(false);
            await fetchUsers();
        } catch (error) {
            setFormError(error.response?.data?.message || 'Failed to create user');
        }
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const fetchRoles = async () => {
        setRolesLoading(true);
        try {
            const fetchedRoles = await listRolesByCompany(companyId);
            setRoles(fetchedRoles);
            setRoleFormError('');
        } catch (error) {
            console.error('Error fetching roles:', error);
            setRoleFormError('Failed to load roles');
        } finally {
            setRolesLoading(false);
        }
    };

    const handleAddRole = async (e) => {
        e.preventDefault();
        setRoleFormError('');

        // Validation
        if (!roleFormData.name) {
            setRoleFormError('Role name is required');
            return;
        }

        try {
            await createRole(
                companyId,
                roleFormData.name,
                roleFormData.description,
                selectedPermissions,
                roleFormData.color
            );
            setRoleFormData({
                name: '',
                description: '',
                permissions: [],
                color: 'blue'
            });
            setSelectedPermissions([]);
            setShowAddRoleModal(false);
            await fetchRoles();
        } catch (error) {
            setRoleFormError(error.response?.data?.message || 'Failed to create role');
        }
    };

    const handlePermissionToggle = (permission) => {
        setSelectedPermissions(prev => {
            if (prev.includes(permission)) {
                return prev.filter(p => p !== permission);
            } else {
                return [...prev, permission];
            }
        });
    };

    const handleRoleFormChange = (e) => {
        const { name, value } = e.target;
        setRoleFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             user.email.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const userCount = users.length;
    const roleStats = {
        'Admin': users.filter(u => u.role === 'Admin').length || 0,
        'Editor': users.filter(u => u.role === 'Editor').length || 0,
        'Viewer': users.filter(u => u.role === 'Viewer').length || 0
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
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#f6c636] text-3xl">manage_accounts</span>
                        <div>
                            <h1 className="text-3xl font-bold text-[#f6c636] font-verdana">User Management</h1>
                            <p className="text-gray-400">Manage users, roles, and permissions</p>
                        </div>
                    </div>
                </div>
                <button 
                    onClick={() => setShowAddUserModal(true)}
                    className="bg-[#197e71] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#27719e] transition-colors duration-200 flex items-center gap-2"
                >
                    <span className="material-symbols-outlined">person_add</span>
                    Add User
                </button>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Tab Navigation */}
                <div className="bg-[#2a2f33] rounded-lg shadow-lg mb-6">
                    <div className="flex border-b border-gray-600">
                        {[
                            { id: 'users', label: 'Users', count: userCount },
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
                            </div>
                        </div>

                        {/* Users List */}
                        <div className="bg-[#2a2f33] rounded-lg shadow-lg overflow-hidden">
                            {isLoading ? (
                                <div className="p-6 text-center text-gray-400">Loading users...</div>
                            ) : filteredUsers.length === 0 ? (
                                <div className="p-6 text-center text-gray-400">No users found</div>
                            ) : (
                                <div className="overflow-x-auto">
                                    <table className="w-full">
                                        <thead className="bg-[#1c1e1f]">
                                            <tr>
                                                <th className="text-left p-4 font-semibold text-[#f6c636]">User</th>
                                                <th className="text-left p-4 font-semibold text-[#f6c636]">Email</th>
                                                <th className="text-left p-4 font-semibold text-[#f6c636]">Status</th>
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
                                                            </div>
                                                        </div>
                                                    </td>
                                                    <td className="p-4 text-gray-400">{user.email}</td>
                                                    <td className="p-4">
                                                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                            user.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                                                        }`}>
                                                            {user.is_active ? 'active' : 'inactive'}
                                                        </span>
                                                    </td>
                                                    <td className="p-4">
                                                        <div className="flex justify-end gap-2">
                                                            <button className="p-2 text-gray-400 hover:text-[#508ec5] hover:bg-gray-700 rounded-lg">
                                                                <span className="material-symbols-outlined">edit</span>
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
                            )}
                        </div>
                    </>
                )}

                {/* Roles Tab */}
                {activeTab === 'roles' && (
                    <>
                        <div className="flex justify-end mb-6">
                            <button 
                                onClick={() => setShowAddRoleModal(true)}
                                className="bg-[#197e71] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#27719e] transition-colors duration-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">add</span>
                                Create Role
                            </button>
                        </div>
                        <div className="space-y-6">
                            {rolesLoading ? (
                                <div className="text-center text-gray-400">Loading roles...</div>
                            ) : roles.length === 0 ? (
                                <div className="text-center text-gray-400">No roles found</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    {roles.map(role => (
                                        <div key={role.id} className="bg-[#2a2f33] rounded-lg shadow-lg p-6">
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-3 h-3 rounded-full ${
                                                        role.color === 'red' ? 'bg-red-500' :
                                                        role.color === 'blue' ? 'bg-blue-500' :
                                                        role.color === 'green' ? 'bg-green-500' :
                                                        'bg-yellow-500'
                                                    }`}></div>
                                                    <h3 className="text-lg font-semibold text-[#f6c636]">{role.name}</h3>
                                                </div>
                                            </div>
                                            {role.description && (
                                                <p className="text-sm text-gray-400 mb-4">{role.description}</p>
                                            )}
                                            <div className="space-y-2">
                                                <h4 className="text-sm font-semibold text-gray-400">PERMISSIONS ({role.permissions?.length || 0})</h4>
                                                {role.permissions && role.permissions.length > 0 ? (
                                                    role.permissions.map((permission, index) => (
                                                        <div key={index} className="flex items-center gap-2 text-sm">
                                                            <span className="material-symbols-outlined text-green-400 text-sm">check_circle</span>
                                                            <span className="text-gray-300">{permission}</span>
                                                        </div>
                                                    ))
                                                ) : (
                                                    <p className="text-gray-500 text-sm">No permissions assigned</p>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </>
                )}

                {/* User Activity Tab */}
                {activeTab === 'activity' && (
                    <div className="bg-[#2a2f33] rounded-lg shadow-lg p-6">
                        <h3 className="text-xl font-semibold text-[#f6c636] mb-6">Recent User Activity</h3>
                        <div className="space-y-4">
                            {[
                                { user: 'Admin User', action: 'Logged into the system', time: '5 minutes ago', type: 'login' },
                                { user: 'Team Member', action: 'Updated profile information', time: '15 minutes ago', type: 'admin' },
                                { user: 'Editor User', action: 'Uploaded a document', time: '1 hour ago', type: 'download' }
                            ].map((activity, index) => (
                                <div key={index} className="flex items-center gap-4 p-4 border border-gray-600 rounded-lg">
                                    <span className={`material-symbols-outlined p-2 rounded-full ${
                                        activity.type === 'login' ? 'bg-green-900/20 text-green-400' :
                                        activity.type === 'admin' ? 'bg-blue-900/20 text-blue-400' :
                                        'bg-yellow-900/20 text-yellow-400'
                                    }`}>
                                        {activity.type === 'login' ? 'login' :
                                         activity.type === 'admin' ? 'admin_panel_settings' : 'download'}
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

            {/* Add User Modal */}
            {showAddUserModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2a2f33] rounded-lg shadow-2xl p-8 max-w-md w-full mx-4">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#f6c636]">Add New User</h2>
                            <button 
                                onClick={() => {
                                    setShowAddUserModal(false);
                                    setFormError('');
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {formError && (
                            <div className="bg-red-900/20 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4">
                                {formError}
                            </div>
                        )}

                        <form onSubmit={handleAddUser} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Full Name</label>
                                <input 
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleFormChange}
                                    placeholder="Enter full name"
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                                <input 
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleFormChange}
                                    placeholder="Enter email"
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role</label>
                                <select 
                                    name="role"
                                    value={formData.role}
                                    onChange={handleFormChange}
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                >
                                    <option value="">Select a role</option>
                                    {roles.map(role => (
                                        <option key={role.id} value={role.name}>{role.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
                                <input 
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleFormChange}
                                    placeholder="Enter password"
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
                                <input 
                                    type="password"
                                    name="confirmPassword"
                                    value={formData.confirmPassword}
                                    onChange={handleFormChange}
                                    placeholder="Confirm password"
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                />
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowAddUserModal(false);
                                        setFormError('');
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#197e71] text-white rounded-lg hover:bg-[#27719e] transition-colors font-medium"
                                >
                                    Add User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Add Role Modal */}
            {showAddRoleModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-[#2a2f33] rounded-lg shadow-2xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-[#f6c636]">Create New Role</h2>
                            <button 
                                onClick={() => {
                                    setShowAddRoleModal(false);
                                    setRoleFormError('');
                                    setRoleFormData({ name: '', description: '', permissions: [], color: 'blue' });
                                    setSelectedPermissions([]);
                                }}
                                className="text-gray-400 hover:text-white"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {roleFormError && (
                            <div className="bg-red-900/20 border border-red-600 text-red-300 px-4 py-3 rounded-lg mb-4">
                                {roleFormError}
                            </div>
                        )}

                        <form onSubmit={handleAddRole} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Role Name</label>
                                <input 
                                    type="text"
                                    name="name"
                                    value={roleFormData.name}
                                    onChange={handleRoleFormChange}
                                    placeholder="Enter role name"
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                                <textarea 
                                    name="description"
                                    value={roleFormData.description}
                                    onChange={handleRoleFormChange}
                                    placeholder="Enter role description"
                                    rows="2"
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">Color</label>
                                <select 
                                    name="color"
                                    value={roleFormData.color}
                                    onChange={handleRoleFormChange}
                                    className="w-full px-4 py-2 bg-[#1c1e1f] text-white border border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#508ec5]"
                                >
                                    <option value="red">Red</option>
                                    <option value="blue">Blue</option>
                                    <option value="green">Green</option>
                                    <option value="yellow">Yellow</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-3">Permissions</label>
                                <div className="bg-[#1c1e1f] rounded-lg p-4 max-h-60 overflow-y-auto border border-gray-600">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {availablePermissions.map((permission, index) => (
                                            <label key={index} className="flex items-center gap-3 cursor-pointer hover:bg-gray-700/30 p-2 rounded">
                                                <input 
                                                    type="checkbox"
                                                    checked={selectedPermissions.includes(permission)}
                                                    onChange={() => handlePermissionToggle(permission)}
                                                    className="w-4 h-4 rounded"
                                                />
                                                <span className="text-sm text-gray-300">{permission}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button 
                                    type="button"
                                    onClick={() => {
                                        setShowAddRoleModal(false);
                                        setRoleFormError('');
                                        setRoleFormData({ name: '', description: '', permissions: [], color: 'blue' });
                                        setSelectedPermissions([]);
                                    }}
                                    className="flex-1 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button 
                                    type="submit"
                                    className="flex-1 px-4 py-2 bg-[#197e71] text-white rounded-lg hover:bg-[#27719e] transition-colors font-medium"
                                >
                                    Create Role
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserManagement;
