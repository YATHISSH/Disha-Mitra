import { useState, useContext } from "react";
import { Link } from 'react-router-dom';
import { assets } from "../../assets/assets";
import PropTypes from 'prop-types';
import { Context } from "../../context/Context";

const Sidebar = () => {
    const { newChat, prevPrompts, chatHistory } = useContext(Context);
    const [extended, setExtended] = useState(false);

    return (
        <>
            {/* Menu Toggle Button */}
            <img 
                onClick={() => setExtended((prev) => !prev)} 
                className="fixed top-4 left-4 z-50 w-8 h-8 cursor-pointer md:hidden" 
                src={assets.menu_icon} 
                alt="menu" 
            />
            <div className={`fixed top-0 left-0 z-40 h-full w-[220px] lg:w-[250px] bg-black p-4 text-[#ffffff] transform ${extended ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 md:flex md:w-[220px] lg:w-[250px] transition-transform duration-300 ease-in-out`}>
                <div className="flex flex-col h-full">
                    {/* Logo */}
                    <img src={assets.user_icon} alt="Logo" className="w-24 mx-auto mb-6" />

                    <Link 
                        to="/" 
                        onClick={newChat} 
                        className="font-bold mt-4 mb-2 flex items-center gap-2 p-2 bg-[#bd4b37] rounded-full text-sm cursor-pointer hover:bg-[#2b79b9]"
                    >
                        <img src={assets.plus_icon} alt="new chat" className="w-5" />
                        <p>New Chat</p>
                    </Link>

                    {/* Sidebar Menu */}
                    <div className="mt-6 flex-1">
                        <p className="text-[#e0f2f1] font-bold mb-2">Previous Chats</p>
                        <div className="flex flex-col gap-1.5">
                            {prevPrompts.map((prompt, index) => (
                                <MenuItem key={index} icon={assets.chat_icon} label={prompt} />
                            ))}
                        </div>

                        <p className="text-[#e0f2f1] font-bold mt-4 mb-2">Chat History</p>
                        <div className="flex flex-col gap-1.5">
                            {chatHistory.map((chat, index) => (
                                <MenuItem key={index} icon={assets.chat_icon} label={chat.prompt} />
                            ))}
                        </div>

                        <p className="text-[#bd4b37] font-bold mt-4 mb-2">Advancements</p>
                      
                        <div className="flex flex-col gap-1.5">
                            <MenuItem icon={assets.compass_icon} label="Best Colleges" />
                            <MenuItem icon={assets.bulb_icon} label="Placements" />
                            <MenuItem icon={assets.history_icon} label="Request Cold Call" />
                            <MenuItem icon={assets.bulb_icon} label="Updates" />
                        </div>
                    </div>

                    {/* Bottom Section with Settings and Activity */}
                    <div className="mt-6">
                        <Link to="/settings" className="flex items-center gap-2 p-2 rounded-full cursor-pointer hover:bg-[#00796b] text-white mb-2">
                            <img src={assets.setting_icon} alt="settings" className="w-5" />
                            <p>Settings</p>
                        </Link>
                    </div>
                </div>
            </div>

            {/* Clickable Overlay to Close Sidebar */}
            {extended && (
                <div 
                    className="fixed inset-0 bg-[#00000080] opacity-50 z-30 md:hidden" 
                    onClick={() => setExtended(false)}
                ></div>
            )}
        </>
    );
};

const MenuItem = ({ icon, label }) => (
    <div className="flex items-start gap-2 p-2 rounded-full text-white cursor-pointer hover:bg-[#333333]">
        <img src={icon} alt={label} className="w-5" />
        <p>{label}</p>
    </div>
);

MenuItem.propTypes = {
    icon: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
};

export default Sidebar;
