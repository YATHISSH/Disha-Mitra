import  { useState, useEffect } from 'react';


const DocumentLibrary = () => {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);

    const categories = [
        { id: 'all', name: 'All Documents', icon: 'folder' },
        { id: 'policies', name: 'Policies', icon: 'policy' },
        { id: 'procedures', name: 'Procedures', icon: 'list_alt' },
        { id: 'training', name: 'Training', icon: 'school' },
        { id: 'compliance', name: 'Compliance', icon: 'verified' },
        { id: 'technical', name: 'Technical', icon: 'engineering' }
    ];

    const mockDocuments = [
        { id: 1, name: 'Employee Handbook 2025', category: 'policies', type: 'PDF', size: '2.4 MB', uploadDate: '2025-01-15', status: 'active' },
        { id: 2, name: 'Data Security Protocol', category: 'compliance', type: 'DOCX', size: '1.8 MB', uploadDate: '2025-01-20', status: 'active' },
        { id: 3, name: 'API Documentation', category: 'technical', type: 'PDF', size: '5.2 MB', uploadDate: '2025-02-01', status: 'active' },
        { id: 4, name: 'New Employee Training', category: 'training', type: 'PPTX', size: '12.5 MB', uploadDate: '2025-02-10', status: 'active' },
        { id: 5, name: 'Quality Assurance Procedures', category: 'procedures', type: 'PDF', size: '3.1 MB', uploadDate: '2025-02-15', status: 'active' }
    ];

    useEffect(() => {
        setDocuments(mockDocuments);
    }, []);

    const handleFileUpload = (event) => {
        const files = Array.from(event.target.files);
        setIsUploading(true);
        
        // Simulate upload progress
        let progress = 0;
        const interval = setInterval(() => {
            progress += 10;
            setUploadProgress(progress);
            if (progress >= 100) {
                clearInterval(interval);
                setIsUploading(false);
                setUploadProgress(0);
                // Add uploaded files to documents list
                const newDocs = files.map((file, index) => ({
                    id: documents.length + index + 1,
                    name: file.name,
                    category: 'policies',
                    type: file.name.split('.').pop().toUpperCase(),
                    size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
                    uploadDate: new Date().toISOString().split('T')[0],
                    status: 'active'
                }));
                setDocuments(prev => [...prev, ...newDocs]);
            }
        }, 200);
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] text-3xl">folder_open</span>
                            <div>
                                <h1 className="text-3xl font-bold text-[#004d40] font-verdana">Document Library</h1>
                                <p className="text-gray-600">Manage and access your company documents</p>
                            </div>
                        </div>
                        <div className="flex gap-3">
                            <input
                                type="file"
                                multiple
                                accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xlsx"
                                onChange={handleFileUpload}
                                className="hidden"
                                id="documentUpload"
                            />
                            <label
                                htmlFor="documentUpload"
                                className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold cursor-pointer hover:bg-[#004d40] transition-colors duration-200 flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">upload</span>
                                Upload Documents
                            </label>
                        </div>
                    </div>
                </div>

                {/* Upload Progress */}
                {isUploading && (
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                        <div className="flex items-center gap-3">
                            <span className="material-symbols-outlined text-[#00796b] animate-spin">sync</span>
                            <div className="flex-1">
                                <p className="text-sm font-medium">Uploading documents...</p>
                                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                                    <div className="bg-[#00796b] h-2 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                                </div>
                            </div>
                            <span className="text-sm text-gray-600">{uploadProgress}%</span>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                    {/* Sidebar Filters */}
                    <div className="bg-white rounded-lg shadow-lg p-6">
                        <h3 className="text-lg font-semibold text-[#004d40] mb-4">Categories</h3>
                        <div className="space-y-2">
                            {categories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                                        selectedCategory === category.id 
                                            ? 'bg-[#00796b] text-white' 
                                            : 'hover:bg-gray-100 text-gray-700'
                                    }`}
                                >
                                    <span className="material-symbols-outlined text-xl">{category.icon}</span>
                                    <span className="font-medium">{category.name}</span>
                                </button>
                            ))}
                        </div>

                        <div className="mt-6 pt-6 border-t border-gray-200">
                            <h4 className="text-sm font-semibold text-gray-600 mb-3">QUICK STATS</h4>
                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span>Total Documents</span>
                                    <span className="font-semibold text-[#00796b]">{documents.length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Active</span>
                                    <span className="font-semibold text-green-600">{documents.filter(d => d.status === 'active').length}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span>Categories</span>
                                    <span className="font-semibold text-[#00796b]">{categories.length - 1}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Document List */}
                    <div className="lg:col-span-3">
                        {/* Search Bar */}
                        <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
                            <div className="relative">
                                <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                    search
                                </span>
                                <input
                                    type="text"
                                    placeholder="Search documents..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:border-transparent"
                                />
                            </div>
                        </div>

                        {/* Documents Grid */}
                        <div className="grid gap-4">
                            {filteredDocuments.map(document => (
                                <div key={document.id} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-[#e0f2f1] rounded-lg flex items-center justify-center">
                                                <span className="material-symbols-outlined text-[#00796b]">
                                                    {document.type === 'PDF' ? 'picture_as_pdf' : 
                                                     document.type === 'DOCX' ? 'description' :
                                                     document.type === 'PPTX' ? 'slideshow' : 'insert_drive_file'}
                                                </span>
                                            </div>
                                            <div>
                                                <h4 className="text-lg font-semibold text-[#004d40]">{document.name}</h4>
                                                <div className="flex items-center gap-4 text-sm text-gray-600 mt-1">
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">category</span>
                                                        {categories.find(c => c.id === document.category)?.name}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">file_copy</span>
                                                        {document.type}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">storage</span>
                                                        {document.size}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <span className="material-symbols-outlined text-xs">schedule</span>
                                                        {document.uploadDate}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                <span className="material-symbols-outlined">visibility</span>
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                <span className="material-symbols-outlined">download</span>
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                <span className="material-symbols-outlined">share</span>
                                            </button>
                                            <button className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                <span className="material-symbols-outlined">delete</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {filteredDocuments.length === 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-12 text-center">
                                <span className="material-symbols-outlined text-6xl text-gray-300 mb-4">folder_open</span>
                                <h3 className="text-xl font-semibold text-gray-600 mb-2">No documents found</h3>
                                <p className="text-gray-500">Try adjusting your search criteria or upload some documents.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DocumentLibrary;
