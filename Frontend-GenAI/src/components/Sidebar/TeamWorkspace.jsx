import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import { getTeamChatHistory, getPrivateChatHistory, listUsersByCompany, getUserDetails } from '../../api';

const TeamWorkspace = () => {
    const [activeTab, setActiveTab] = useState('team');
    // Removed dummy teamMembers; using `users` from API instead

    const [projects] = useState([
        { id: 1, name: 'Q1 Policy Review', progress: 75, team: 3, dueDate: '2025-03-15', priority: 'high' },
        { id: 2, name: 'Security Documentation', progress: 50, team: 2, dueDate: '2025-04-01', priority: 'medium' },
        { id: 3, name: 'Training Material Update', progress: 90, team: 4, dueDate: '2025-02-28', priority: 'low' }
    ]);

    // Chat states
    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [isConnected, setIsConnected] = useState(false);
    const messagesEndRef = useRef(null);
    const currentUser = getUserDetails();
    const [chatMode, setChatMode] = useState('team'); // 'team' | 'private'
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);

    // Scroll to bottom of messages
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Initialize Socket.IO connection
    useEffect(() => {
        const token = localStorage.getItem('jwtToken');
        if (!token) {
            console.error('No JWT token found');
            return;
        }

        const newSocket = io('http://localhost:3001', {
            auth: { token },
            transports: ['websocket']
        });

        newSocket.on('connect', () => {
            console.log('Connected to server');
            setIsConnected(true);
        });

        newSocket.on('disconnect', () => {
            console.log('Disconnected from server');
            setIsConnected(false);
        });

        newSocket.on('team_message', (data) => {
            setMessages(prev => [...prev, data]);
        });

        newSocket.on('error', (error) => {
            console.error('Socket error:', error);
        });

        newSocket.on('connect_error', (err) => {
            console.error('Socket connect error:', err.message);
        });

        setSocket(newSocket);

        // Load users and default team chat history
        loadUsers();
        loadTeamChat();

        return () => {
            newSocket.close();
        };
    }, []);

    // Attach private message listener with fresh state
    useEffect(() => {
        if (!socket) return;
        const handler = (data) => {
            if (chatMode === 'private' && selectedUser && currentUser) {
                const isRelevant = (
                    (data.user_id === selectedUser.id && data.to_user_id === currentUser.id) ||
                    (data.user_id === currentUser.id && data.to_user_id === selectedUser.id)
                );
                if (isRelevant) {
                    setMessages(prev => [...prev, data]);
                }
            }
        };
        socket.on('private_message', handler);
        return () => {
            socket.off('private_message', handler);
        };
    }, [socket, chatMode, selectedUser, currentUser]);

    const loadUsers = async () => {
        try {
            if (!currentUser) return;
            const list = await listUsersByCompany(currentUser.companyId);
            // Exclude current user
            setUsers(list.filter(u => u.id !== currentUser.id));
        } catch (error) {
            console.error('Error loading users:', error);
        }
    };

    const loadTeamChat = async () => {
        try {
            const history = await getTeamChatHistory();
            setMessages(history);
        } catch (error) {
            console.error('Error loading team chat:', error);
        }
    };

    const loadPrivateChat = async (otherUser) => {
        try {
            const history = await getPrivateChatHistory(otherUser.id);
            setMessages(history);
        } catch (error) {
            console.error('Error loading private chat:', error);
        }
    };

    const sendMessage = () => {
        if (!newMessage.trim() || !socket || !isConnected) return;
        if (chatMode === 'team') {
            socket.emit('team_message', { message: newMessage });
        } else if (chatMode === 'private' && selectedUser) {
            socket.emit('private_message', { toUserId: selectedUser.id, toUserName: selectedUser.name, message: newMessage });
        }
        setNewMessage('');
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    const formatTime = (timestamp) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString('en-US', { 
            hour: '2-digit', 
            minute: '2-digit' 
        });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center gap-3">
                        <span className="material-symbols-outlined text-[#00796b] text-3xl">groups</span>
                        <div>
                            <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Team Workspace</h1>
                            <p className="text-gray-600">Collaborate with your team members</p>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="bg-white rounded-lg shadow-lg mb-6">
                    <div className="flex border-b">
                        {[
                            { id: 'team', label: 'Team Members', icon: 'people' },
                            { id: 'projects', label: 'Projects', icon: 'work' },
                            { id: 'chat', label: 'Team Chat', icon: 'chat' }
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

                {/* Team Members Tab (API-driven) */}
                {activeTab === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map(user => (
                            <div key={user.id} className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-[#e0f2f1] rounded-full flex items-center justify-center">
                                            <span className="material-symbols-outlined text-[#00796b] text-2xl">person</span>
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                            user.is_active ? 'bg-green-500' : 'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#004d40]">{user.name}</h3>
                                        <p className="text-sm text-gray-600">{user.email}</p>
                                        <p className="text-xs text-gray-500">Status: {user.is_active ? 'Active' : 'Inactive'}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button 
                                        className="flex-1 bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-200"
                                        onClick={() => { setActiveTab('chat'); setChatMode('private'); setSelectedUser(user); loadPrivateChat(user); }}
                                    >
                                        Message
                                    </button>
                                    <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                                        <span className="material-symbols-outlined">more_vert</span>
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Add Member Card */}
                        <div className="bg-white rounded-lg shadow-lg p-6 border-2 border-dashed border-gray-300 flex flex-col items-center justify-center">
                            <span className="material-symbols-outlined text-4xl text-gray-400 mb-4">person_add</span>
                            <h3 className="text-lg font-semibold text-gray-600 mb-2">Add Team Member</h3>
                            <button className="bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                Invite Member
                            </button>
                        </div>
                    </div>
                )}

                {/* Projects Tab */}
                {activeTab === 'projects' && (
                    <div className="space-y-6">
                        {projects.map(project => (
                            <div key={project.id} className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <h3 className="text-xl font-semibold text-[#004d40]">{project.name}</h3>
                                        <p className="text-sm text-gray-600">Due: {project.dueDate}</p>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                            project.priority === 'high' ? 'bg-red-100 text-red-600' :
                                            project.priority === 'medium' ? 'bg-yellow-100 text-yellow-600' :
                                            'bg-green-100 text-green-600'
                                        }`}>
                                            {project.priority.toUpperCase()}
                                        </span>
                                        <div className="flex items-center gap-1">
                                            <span className="material-symbols-outlined text-gray-500">people</span>
                                            <span className="text-sm text-gray-600">{project.team}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="mb-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-sm text-gray-600">Progress</span>
                                        <span className="text-sm font-medium text-[#00796b]">{project.progress}%</span>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-[#00796b] h-2 rounded-full transition-all duration-300" 
                                            style={{ width: `${project.progress}%` }}
                                        ></div>
                                    </div>
                                </div>
                                <div className="flex justify-between items-center">
                                    <div className="flex -space-x-2">
                                        {users.slice(0, project.team).map((member, index) => (
                                            <div key={index} className="w-8 h-8 bg-[#e0f2f1] rounded-full border-2 border-white flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#00796b] text-base">person</span>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Team Chat Tab */}
                {activeTab === 'chat' && (
                    <div className="bg-white rounded-lg shadow-lg h-[600px] flex">
                        {/* Left sidebar for chat mode and users */}
                        <div className="w-64 border-r p-4">
                            <div className="mb-4">
                                <div className="flex gap-2">
                                    <button
                                        className={`flex-1 px-3 py-2 rounded ${chatMode === 'team' ? 'bg-[#00796b] text-white' : 'bg-gray-100'}`}
                                        onClick={() => { setChatMode('team'); setSelectedUser(null); loadTeamChat(); }}
                                    >Team</button>
                                    <button
                                        className={`flex-1 px-3 py-2 rounded ${chatMode === 'private' ? 'bg-[#00796b] text-white' : 'bg-gray-100'}`}
                                        onClick={() => { setChatMode('private'); setMessages([]); }}
                                    >Direct</button>
                                </div>
                            </div>
                            {chatMode === 'private' && (
                                <div>
                                    <h4 className="text-sm font-medium text-gray-600 mb-2">Team Members</h4>
                                    <div className="space-y-2">
                                        {users.map(u => (
                                            <button
                                                key={u.id}
                                                className={`w-full text-left px-3 py-2 rounded ${selectedUser?.id === u.id ? 'bg-[#e0f2f1]' : 'hover:bg-gray-100'}`}
                                                onClick={() => { setSelectedUser(u); loadPrivateChat(u); }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 bg-[#e0f2f1] rounded-full flex items-center justify-center text-xs">
                                                        {u.name?.substring(0,2).toUpperCase()}
                                                    </div>
                                                    <div className="flex-1">
                                                        <div className="text-sm text-[#004d40]">{u.name}</div>
                                                        <div className="text-xs text-gray-500">{u.email}</div>
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right chat area */}
                        <div className="flex-1 flex flex-col">
                            <div className="p-4 border-b flex items-center justify-between">
                                <h3 className="text-lg font-semibold text-[#004d40]">
                                    {chatMode === 'team' ? 'Team Discussion' : (selectedUser ? `Chat with ${selectedUser.name}` : 'Direct Messages')}
                                </h3>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
                                    <span className="text-sm text-gray-600">{isConnected ? 'Connected' : 'Disconnected'}</span>
                                </div>
                            </div>
                            <div className="flex-1 p-4 overflow-y-auto">
                                <div className="space-y-4">
                                    {messages.map((msg, index) => {
                                        const isCurrentUser = currentUser && msg.user_id === currentUser.id;
                                        return (
                                            <div key={msg.id || index} className={`flex gap-3 ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                                                <div className="w-8 h-8 bg-[#e0f2f1] rounded-full flex items-center justify-center text-xs font-medium flex-shrink-0">
                                                    {msg.user_name?.substring(0, 2).toUpperCase()}
                                                </div>
                                                <div className={`flex-1 max-w-md ${isCurrentUser ? 'text-right' : ''}`}>
                                                    <div className="flex items-center gap-2 mb-1">
                                                        <span className={`font-medium text-[#004d40] text-sm ${isCurrentUser ? 'order-2' : ''}`}>
                                                            {isCurrentUser ? 'You' : msg.user_name}
                                                        </span>
                                                        <span className="text-xs text-gray-500">{formatTime(msg.timestamp)}</span>
                                                    </div>
                                                    <div className={`inline-block p-3 rounded-lg ${isCurrentUser ? 'bg-[#00796b] text-white' : 'bg-gray-100 text-gray-700'}`}>
                                                        <p className="break-words">{msg.message}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                    <div ref={messagesEndRef} />
                                </div>
                            </div>
                            <div className="p-4 border-t">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newMessage}
                                        onChange={(e) => setNewMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder={chatMode === 'team' ? 'Type a team message...' : (selectedUser ? `Message ${selectedUser.name}...` : 'Select a user to start chatting')}
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                        disabled={!isConnected || (chatMode === 'private' && !selectedUser)}
                                    />
                                    <button
                                        onClick={sendMessage}
                                        disabled={!isConnected || !newMessage.trim() || (chatMode === 'private' && !selectedUser)}
                                        className="bg-[#00796b] text-white p-2 rounded-lg hover:bg-[#004d40] transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <span className="material-symbols-outlined">send</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamWorkspace;
