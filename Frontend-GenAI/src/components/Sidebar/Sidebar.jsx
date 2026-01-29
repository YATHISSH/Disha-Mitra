import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";
import axios from 'axios';

const Sidebar = () => {
    // Retrieve user information from the context
    const { newChat, startNewSession, prevPrompts, chatHistory, username: contextUsername } = useContext(Context);
    const [extended, setExtended] = useState(false);
    const [username, setUsername] = useState(localStorage.getItem('username') || contextUsername || '');
    const navigate = useNavigate();

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 768) {
                setExtended(true); 
            } else {
                setExtended(false); 
            }
        };

        window.addEventListener('resize', handleResize);
        handleResize();

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // Fetch user data from backend if not available in localStorage or context
        const fetchUserData = async () => {
            if (!username) {  
                try {
                    const response = await axios.get('http://localhost:3001/auth/login'); 
                    const fetchedUsername = response.data.username;
                    setUsername(fetchedUsername);
                    localStorage.setItem('username', fetchedUsername);
                } catch (error) {
                    console.error('Error fetching user data:', error);
                }
            }
        };

        fetchUserData();
    }, [contextUsername]);

    const handleToggle = () => {
        setExtended((prev) => !prev);
    };

    const { updateUsername, setuseremail } = useContext(Context);
    const handleLogout = () => {
        // Remove all user-related data from localStorage
        localStorage.removeItem('username');
        localStorage.removeItem('token');
        // Clear context values
        setUsername('');
        updateUsername('');
        setuseremail('');
        // Navigate to login and reload to clear all cached state
        navigate('/login');
        setTimeout(() => window.location.reload(), 100);
    };

    // Function to handle navigation and close sidebar
    const handleNavigateAndClose = (path) => {
        navigate(path);
        setExtended(false); // Close the sidebar
    };

    // Function to handle Link clicks and close sidebar
    const handleLinkClick = () => {
        setExtended(false); // Close the sidebar when any Link is clicked
    };

    return (
        <>
            {/* Menu Toggle Button */}
            <span 
                onClick={handleToggle} 
                className="fixed top-4 left-4 z-50 cursor-pointer text-[#ffffff] font-verdana" 
            >
                <span className="material-symbols-outlined text-[32px]">
                    {extended ? 'menu_open' : 'menu'}
                </span>
            </span>

            {/* Sidebar Container */}
            <div className={`fixed top-0 left-0 z-40 h-full w-[240px] lg:w-[260px] bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] shadow-lg p-4 text-[#ffffff] transform ${extended ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full font-verdana">
                    {/* Logo */}
                    <img src={assets.bbq_icon} alt="Logo" className="w-24 mx-auto mb-4 rounded-full" />

                    {/* New Chat Button */}
                    <button
                        onClick={async () => {
                            // Prevent new session if current session is empty (no messages)
                            const main = document.querySelector('.flex-1.max-w-[900px]');
                            const hasMessages = main && main.querySelectorAll('.flex.items-start').length > 0;
                            if (!hasMessages) {
                                alert('Please send a message before starting a new session.');
                                return;
                            }
                            try {
                                const sessionId = await startNewSession('New Session');
                                if (sessionId) {
                                    navigate(`/${sessionId}`);
                                }
                            } catch (err) {
                                console.error('Failed to start new session:', err);
                            }
                        }} 
                        className="font-bold text-sm flex items-center gap-2 p-3 bg-[#197e71] rounded-full cursor-pointer hover:bg-[#27719e] transition-colors duration-200"
                    >
                        <img src={assets.plus_icon} alt="new chat" className="w-5" />
                        <p className="font-verdana">New Session</p>
                    </button>

                    {/* Sidebar Menu */}
                    <div className="mt-6 flex-1 overflow-y-auto">
                        {/* Previous Prompts and Chat History */}
                        <div className="flex flex-col gap-2">
                            {prevPrompts.map((prompt, index) => (   
                                <button 
                                    key={index} 
                                    onClick={() => handleNavigateAndClose('/chathistory')}
                                    className="flex items-center gap-2 p-3 rounded-full text-white cursor-pointer hover:bg-[#333333] transition-colors duration-200"
                                >
                                    <img src={assets.chat_icon} alt={prompt} className="w-5" />
                                    <p className="text-sm font-medium truncate">{prompt}</p>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {chatHistory.map((chat, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => handleNavigateAndClose('/chathistory')}
                                    className="flex items-center gap-2 p-3 rounded-full text-white cursor-pointer hover:bg-[#333333] transition-colors duration-200"
                                >
                                    <img src={assets.chat_icon} alt={chat.prompt} className="w-5" />
                                    <p className="text-sm font-medium truncate">{chat.prompt}</p>
                                </button>
                            ))}
                        </div>

                        <p className="text-[#f6c636] font-semibold text-md mt-6 mb-3">FEATURES</p>
                        <div className="flex flex-col gap-2">
                            {/* Document Library */}
                            <Link 
                                to="/document-library" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    folder_open
                                </span>
                                <p>Document Library</p>
                            </Link>

                            {/* Analytics Dashboard */}
                            <Link 
                                to="/analytics" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    analytics
                                </span>
                                <p>Analytics Hub</p>
                            </Link>

                            {/* Team Workspace */}
                            <Link 
                                to="/team-workspace" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    groups
                                </span>
                                <p>Team Workspace</p>
                            </Link>

                            {/* Knowledge Base */}
                            <Link 
                                to="/knowledge-base" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    psychology
                                </span>
                                <p>Knowledge Base</p>
                            </Link>

                            {/* Integration Hub */}
                            <Link 
                                to="/integrations" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    hub
                                </span>
                                <p>Integration Hub</p>
                            </Link>

                            {/* Security Center */}
                            <Link 
                                to="/security" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    security
                                </span>
                                <p>Security Center</p>
                            </Link>

                            {/* API Management */}
                            <Link 
                                to="/api-management" 
                                onClick={handleLinkClick}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    api
                                </span>
                                <p>API Management</p>
                            </Link>

                            {/* Previous Sessions */}
                            <button 
                                onClick={() => handleNavigateAndClose('/chathistory')}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200 md:p-3 sm:p-2"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    history
                                </span>
                                <p className="text-sm md:text-base">Session History</p>
                            </button>
                        </div>

                        {/* Divider */}
                        <div className="border-t border-gray-600 mt-4 pt-4">
                            <p className="text-[#f6c636] font-semibold text-md mb-3">ADMIN TOOLS</p>
                            <div className="flex flex-col gap-2">
                                {/* User Management */}
                                <Link 
                                    to="/user-management" 
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                                >
                                    <span className="material-symbols-outlined text-white text-[20px]">
                                        manage_accounts
                                    </span>
                                    <p>User Management</p>
                                </Link>

                                {/* System Settings */}
                                <Link 
                                    to="/settings" 
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                                >
                                    <span className="material-symbols-outlined text-white text-[20px]">
                                        settings
                                    </span>
                                    <p>System Settings</p>
                                </Link>

                                {/* Audit Logs */}
                                <Link 
                                    to="/audit-logs" 
                                    onClick={handleLinkClick}
                                    className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200"
                                >
                                    <span className="material-symbols-outlined text-white text-[20px]">
                                        assignment
                                    </span>
                                    <p>Audit Logs</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* User Info and Logout Section */}
                    <div className="mt-6 border-t border-gray-600 pt-4">
                        {/* User Role Badge */}
                        <div className="flex items-center justify-between mb-2 p-2 rounded-lg bg-[#004d40]">
                            <div className="flex items-center gap-2">
                                <span className="material-symbols-outlined text-[#80cbc4] text-[16px]">
                                    badge
                                </span>
                                <p className="text-xs text-[#80cbc4]">Enterprise User</p>
                            </div>
                        </div>

                        {/* User Icon and Username */}
                        <div className="flex items-center gap-2 mb-4 p-3 rounded-full hover:bg-[#000000] hover:text-[#508ec5] bg-[#2a2f33] text-white">
                            <img src={assets.user_icon} alt="User" className="w-6 h-6 rounded-full" />
                            <div className="flex-1">
                                <p className="text-sm md:text-base font-medium">{username || 'User'}</p>
                                <p className="text-xs text-gray-400">Active Session</p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="flex gap-2 mb-3">
                            <button className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-[#2a2f33] hover:bg-[#000000] text-white transition-colors duration-200">
                                <span className="material-symbols-outlined text-[16px]">
                                    help
                                </span>
                                <p className="text-xs">Help</p>
                            </button>
                            <button className="flex-1 flex items-center justify-center gap-1 p-2 rounded-lg bg-[#2a2f33] hover:bg-[#000000] text-white transition-colors duration-200">
                                <span className="material-symbols-outlined text-[16px]">
                                    support
                                </span>
                                <p className="text-xs">Support</p>
                            </button>
                        </div>

                        {/* Logout */}
                        <div onClick={handleLogout} className="flex items-center gap-2 p-3 rounded-full cursor-pointer hover:bg-[#d32f2f] text-white transition-colors duration-200 border border-gray-600">
                            <span className="material-symbols-outlined text-white text-[20px]">
                                logout
                            </span>
                            <p className="font-bold">Sign Out</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Clickable Overlay to Close Sidebar on Mobile */}
            {extended && (
                <div 
                    className="fixed inset-0 bg-[#00000080] opacity-50 z-30 md:hidden lg:hidden" 
                    onClick={handleToggle}
                ></div>
            )}
        </>
    );
};

export default Sidebar;
