import { useContext, useState } from 'react';
import { Context } from '../../context/Context';

const ChatHistory = () => {
    const { chatHistory, setInput, onSent, loading, setRecentPrompt } = useContext(Context);
    const [selectedChat, setSelectedChat] = useState(null);

    // Handles selection of a chat from the history list
    const handleChatSelection = (index) => {
        const selected = chatHistory[index];
        setSelectedChat(selected);
        setInput(''); // Clear the input field when a new chat is selected
        setRecentPrompt(selected.prompt); // Set the recent prompt to the selected chat's prompt
    };

    // Handles input change for continuing the chat
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // Handles sending a message to continue the chat
    const handleSend = () => {
        if (selectedChat) {
            onSent(selectedChat.prompt); // Sends the selected chat's prompt
        }
    };

    return (
        <div className="flex">
            {/* Sidebar: List of all chat history */}
            <div className="w-1/4 p-4 bg-gray-800 text-white h-screen overflow-y-auto">
                <h2 className="text-lg font-bold mb-4">Chat History</h2>
                <ul className="space-y-2">
                    {chatHistory.map((chat, index) => (
                        <li
                            key={index}
                            className={`p-2 rounded cursor-pointer hover:bg-gray-600 ${
                                selectedChat === chat ? 'bg-gray-600' : 'bg-gray-700'
                            }`}
                            onClick={() => handleChatSelection(index)}
                        >
                            {chat.prompt}
                        </li>
                    ))}
                </ul>
            </div>

            {/* Main Content: Display selected chat and allow continuation */}
            <div className="w-3/4 p-4">
                {selectedChat ? (
                    <div>
                        <h3 className="text-xl font-bold mb-2">Selected Chat</h3>
                        <div className="bg-gray-100 p-4 rounded-lg mb-4">
                            <p><strong>Prompt:</strong> {selectedChat.prompt}</p>
                            <p><strong>Response:</strong></p>
                            <div dangerouslySetInnerHTML={{ __html: selectedChat.response }} />
                        </div>
                        <div className="mt-4">
                            <input
                                type="text"
                                className="w-full p-2 border border-gray-300 rounded"
                                placeholder="Continue the chat..."
                                onChange={handleInputChange}
                                value={selectedChat.prompt} // Display the selected chat's prompt
                            />
                            <button
                                className="mt-2 p-2 bg-blue-600 text-white rounded hover:bg-blue-500"
                                onClick={handleSend}
                                disabled={loading}
                            >
                                {loading ? 'Sending...' : 'Send'}
                            </button>
                        </div>
                    </div>
                ) : (
                    <p>Select a chat to view and continue.</p>
                )}
            </div>
        </div>
    );
};

export default ChatHistory;
