import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getChatSessions, getSessionMessages } from '../../api';

const ChatHistory = () => {
    const navigate = useNavigate();
    const [sessions, setSessions] = useState([]);
    const [selectedSession, setSelectedSession] = useState(null);
    const [messages, setMessages] = useState([]);
    const [loadingSessions, setLoadingSessions] = useState(true);

    // Fetch chat sessions when component mounts
    useEffect(() => {
        const fetchSessions = async () => {
            try {
                setLoadingSessions(true);
                const sessionsData = await getChatSessions();
                setSessions(sessionsData);
            } catch (error) {
                console.error('Error fetching sessions:', error);
            } finally {
                setLoadingSessions(false);
            }
        };
        fetchSessions();
    }, []);

    // Handles selection of a session from the sidebar - navigate to session chat
    const handleSessionSelection = async (session) => {
        setSelectedSession(session);
        try {
            const sessionMessages = await getSessionMessages(session.session_id);
            setMessages(sessionMessages);
        } catch (error) {
            console.error('Error fetching session messages:', error);
            setMessages([]);
        }
    };

    // Navigate to chatbot with session_id to continue chatting
    const openSessionChat = (sessionId) => {
        navigate(`/chatbot/${sessionId}`);
    };

    return (
        <div className="flex h-screen">
            {/* Sidebar: List of all sessions */}
            <div className="w-1/4 bg-gradient-to-br from-[#1c1e1f] to-[#1c2120] font-verdana text-white p-4 space-y-4 overflow-y-auto">
                <h2 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2">Chat Sessions</h2>
                {loadingSessions ? (
                    <p className="text-gray-400">Loading sessions...</p>
                ) : (
                    <ul className="space-y-2">
                        {sessions.map((session) => (
                            <li
                                key={session.session_id}
                                className={`p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                                    selectedSession?.session_id === session.session_id ? 'bg-gray-800' : 'hover:bg-gray-700'
                                }`}
                                onClick={() => handleSessionSelection(session)}
                            >
                                <p className="text-sm text-gray-400">Session #{session.session_id}</p>
                                <p className="text-xs text-gray-500">{session.messages} messages</p>
                                <p className="text-xs text-gray-500">{new Date(session.last_activity).toLocaleString()}</p>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

            {/* Main Content: Display session conversation thread */}
            <div className="flex-1 p-6 bg-gray-100 overflow-y-auto">
                {selectedSession ? (
                    <div className="bg-white shadow-lg rounded-lg p-6">
                        <h3 className="text-2xl font-semibold mb-4 border-b border-gray-300 pb-2">
                            Session #{selectedSession.session_id}
                        </h3>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                            {messages.length > 0 ? (
                                messages.map((msg, idx) => (
                                    <div key={idx} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                        <p className="font-semibold text-gray-700 mb-1"><strong>You:</strong></p>
                                        <p className="text-gray-900 mb-3">{msg.userMessage}</p>
                                        <p className="font-semibold text-gray-700 mb-1"><strong>Assistant:</strong></p>
                                        <p className="text-gray-900">{msg.botResponse}</p>
                                        <p className="text-xs text-gray-500 mt-2">{new Date(msg.timestamp).toLocaleString()}</p>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-500">No messages in this session yet.</p>
                            )}
                        </div>
                        <button
                            className="w-full p-3 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onClick={() => openSessionChat(selectedSession.session_id)}
                        >
                            Continue in Chatbot
                        </button>
                    </div>
                ) : (
                    <p className="text-gray-600">Select a session to view its conversation.</p>
                )}
            </div>
        </div>
    );
};

export default ChatHistory;
