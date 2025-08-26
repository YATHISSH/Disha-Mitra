import { useState } from 'react';

const TeamWorkspace = () => {
    const [activeTab, setActiveTab] = useState('team');
    const [teamMembers] = useState([
        { id: 1, name: 'S Yathissh', role: 'Project Manager', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026704d' },
        { id: 2, name: 'Rishi Kumar S', role: 'Lead Developer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026705d' },
        { id: 3, name: 'Sachin A', role: 'UX/UI Designer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026706d' },
        { id: 4, name: 'Jashvarthini R', role: 'QA Tester', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026707d' },
        { id: 5, name: 'N J Meenakshi', role: 'Backend Developer', avatar: 'https://i.pravatar.cc/150?u=a042581f4e29026708d' }
    ]);

    const [projects] = useState([
        { id: 1, name: 'Q1 Policy Review', progress: 75, team: 3, dueDate: '2025-03-15', priority: 'high' },
        { id: 2, name: 'Security Documentation', progress: 50, team: 2, dueDate: '2025-04-01', priority: 'medium' },
        { id: 3, name: 'Training Material Update', progress: 90, team: 4, dueDate: '2025-02-28', priority: 'low' }
    ]);

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

                {/* Team Members Tab */}
                {activeTab === 'team' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map(member => (
                            <div key={member.id} className="bg-white rounded-lg shadow-lg p-6">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="relative">
                                        <div className="w-12 h-12 bg-[#e0f2f1] rounded-full flex items-center justify-center text-2xl">
                                            {member.avatar}
                                        </div>
                                        <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                                            member.status === 'online' ? 'bg-green-500' :
                                            member.status === 'away' ? 'bg-yellow-500' : 'bg-gray-400'
                                        }`}></div>
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-[#004d40]">{member.name}</h3>
                                        <p className="text-sm text-gray-600">{member.role}</p>
                                        <p className="text-xs text-gray-500">Last active: {member.lastActive}</p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button className="flex-1 bg-[#00796b] text-white py-2 px-4 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
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
                                        {teamMembers.slice(0, project.team).map((member, index) => (
                                            <div key={index} className="w-8 h-8 bg-[#e0f2f1] rounded-full border-2 border-white flex items-center justify-center text-sm">
                                                {member.avatar}
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
                    <div className="bg-white rounded-lg shadow-lg h-96 flex flex-col">
                        <div className="p-4 border-b">
                            <h3 className="text-lg font-semibold text-[#004d40]">Team Discussion</h3>
                        </div>
                        <div className="flex-1 p-4 overflow-y-auto">
                            <div className="space-y-4">
                                {[
                                    { user: 'John Smith', message: 'The new policy documents are ready for review', time: '10:30 AM', avatar: '👨‍💼' },
                                    { user: 'Sarah Johnson', message: 'Great! I\'ll check them this afternoon', time: '10:32 AM', avatar: '👩‍💻' },
                                    { user: 'Mike Davis', message: 'Should we schedule a team meeting?', time: '10:35 AM', avatar: '👨‍💻' }
                                ].map((chat, index) => (
                                    <div key={index} className="flex gap-3">
                                        <div className="w-8 h-8 bg-[#e0f2f1] rounded-full flex items-center justify-center text-sm flex-shrink-0">
                                            {chat.avatar}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-[#004d40]">{chat.user}</span>
                                                <span className="text-xs text-gray-500">{chat.time}</span>
                                            </div>
                                            <p className="text-gray-700">{chat.message}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="p-4 border-t">
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Type a message..."
                                    className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-[#00796b]"
                                />
                                <button className="bg-[#00796b] text-white p-2 rounded-lg hover:bg-[#004d40] transition-colors duration-200">
                                    <span className="material-symbols-outlined">send</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TeamWorkspace;
