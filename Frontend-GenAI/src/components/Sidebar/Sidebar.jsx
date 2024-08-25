import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from 'react-router-dom';
import { assets } from "../../assets/assets";
import { Context } from "../../context/Context";

const Sidebar = () => {
    const { newChat, prevPrompts, chatHistory } = useContext(Context);
    const [extended, setExtended] = useState(false);
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

    const handleToggle = () => {
        setExtended((prev) => !prev);
    };

    const handleLogout = () => {
        navigate('/');
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

            <div className={`fixed top-0 left-0 z-40 h-full w-[200px] lg:w-[220px] bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] shadow-lg p-4 text-[#ffffff] transform ${extended ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full font-verdana">
                    {/* Logo */}
                    <img src={assets.bbq_icon} alt="Logo" className="w-24 mx-auto mb-4 rounded-full" />

                    {/* New Chat Button */}
                    <button
                        onClick={newChat} 
                        className="font-bold text-sm flex items-center gap-2 p-3 bg-[#197e71] rounded-full cursor-pointer hover:bg-[#27719e] transition-colors duration-200"
                    >
                        <img src={assets.plus_icon} alt="new chat" className="w-5" />
                        <p className="font-verdana">New Chat</p>
                    </button>

                    {/* Sidebar Menu */}
                    <div className="mt-6 flex-1 overflow-y-auto">
                        <div className="flex flex-col gap-2">
                            {prevPrompts.map((prompt, index) => (   
                                <button 
                                    key={index} 
                                    onClick={() => navigate('/chathistory')}
                                    className="flex items-center gap-2 p-3 rounded-full text-white cursor-pointer hover:bg-[#333333] transition-colors duration-200"
                                >
                                    <img src={assets.chat_icon} alt={prompt} className="w-5" />
                                    <p className="text-sm font-medium">{prompt}</p>
                                </button>
                            ))}
                        </div>
                        <div className="flex flex-col gap-2 mt-2">
                            {chatHistory.map((chat, index) => (
                                <button 
                                    key={index} 
                                    onClick={() => navigate('/chathistory')}
                                    className="flex items-center gap-2 p-3 rounded-full text-white cursor-pointer hover:bg-[#333333] transition-colors duration-200"
                                >
                                    <img src={assets.chat_icon} alt={chat.prompt} className="w-5" />
                                    <p className="text-sm font-medium">{chat.prompt}</p>
                                </button>
                            ))}
                        </div>

                        <p className="text-[#f6c636] font-semibold text-md mt-6 mb-3">ENHANCEMENTS</p>
                        <div className="flex flex-col gap-2">
                            <Link to="/best-colleges" className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200">
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    school
                                </span>
                                <p>Best Colleges</p>
                            </Link>
                            <Link to="/placements" className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200">
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    work
                                </span>
                                <p>Placements</p>
                            </Link>
                            <Link to="/cold-call" className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200">
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    call
                                </span>
                                <p>AI Cold Call</p>
                            </Link>
                            <Link to="/updates" className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200">
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    update
                                </span>
                                <p>Updates</p>
                            </Link>
                            <button 
                                onClick={() => navigate('/chathistory')}
                                className="flex items-center gap-2 p-3 rounded-full bg-[#2a2f33] cursor-pointer hover:bg-[#000000] hover:text-[#508ec5] text-white transition-colors duration-200 md:p-3 sm:p-2"
                            >
                                <span className="material-symbols-outlined text-white text-[20px]">
                                    history
                                </span>
                                <p className="text-sm md:text-base">Previous Chats</p>
                            </button>
                        </div>
                    </div>

                    {/* Bottom Section with Logout */}
                    <div className="mt-6">
                        <div onClick={handleLogout} className="flex items-center gap-2 p-3 rounded-full cursor-pointer hover:bg-[#1f8071] text-white transition-colors duration-200">
                            <span className="material-symbols-outlined text-white text-[20px]">
                                logout
                            </span>
                            <p className="font-bold">Logout</p>
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
