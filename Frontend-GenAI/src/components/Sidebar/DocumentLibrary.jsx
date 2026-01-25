import  { useState, useEffect } from 'react';
import { uploadDocument, listDocuments, deleteDocument, downloadDocument, viewDocument as fetchViewDocument } from '../../api';


const DocumentLibrary = () => {
    const [documents, setDocuments] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [uploadProgress, setUploadProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedUploadCategory, setSelectedUploadCategory] = useState('policies');
    const [uploadError, setUploadError] = useState('');
    const [isLoadingDocuments, setIsLoadingDocuments] = useState(false);
    const [viewedDocument, setViewedDocument] = useState(null);
    const [showViewModal, setShowViewModal] = useState(false);

    const categories = [
        { id: 'all', name: 'All Documents', icon: 'folder' },
        { id: 'policies', name: 'Policies', icon: 'policy' },
        { id: 'procedures', name: 'Procedures', icon: 'list_alt' },
        { id: 'training', name: 'Training', icon: 'school' },
        { id: 'compliance', name: 'Compliance', icon: 'verified' },
        { id: 'technical', name: 'Technical', icon: 'engineering' }
    ];

    useEffect(() => {
        fetchDocuments();
    }, []);

    const fetchDocuments = async () => {
        try {
            setIsLoadingDocuments(true);
            const docs = await listDocuments(selectedCategory === 'all' ? '' : selectedCategory);
            setDocuments(docs);
        } catch (error) {
            console.error('Failed to fetch documents:', error);
        } finally {
            setIsLoadingDocuments(false);
        }
    };

    useEffect(() => {
        fetchDocuments();
    }, [selectedCategory]);

    const openUploadModal = () => {
        setShowUploadModal(true);
    };

    const handleUploadSubmit = async () => {
        if (!selectedFile) {
            setUploadError('Please select a file');
            return;
        }

        if (!selectedUploadCategory) {
            setUploadError('Please select a category');
            return;
        }

        try {
            setUploadError('');
            setIsUploading(true);
            setUploadProgress(0);

            // Simulate progress
            let progressInterval = setInterval(() => {
                setUploadProgress(prev => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return prev;
                    }
                    return prev + 10;
                });
            }, 100);

            await uploadDocument(selectedFile, selectedUploadCategory);

            clearInterval(progressInterval);
            setUploadProgress(100);
            
            // Refresh documents list
            setTimeout(() => {
                setIsUploading(false);
                setUploadProgress(0);
                setShowUploadModal(false);
                setSelectedFile(null);
                setSelectedUploadCategory('policies');
                fetchDocuments();
            }, 500);
        } catch (error) {
            console.error('Upload failed:', error);
            setUploadError(error.response?.data?.error || 'Upload failed. Please try again.');
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleDeleteDocument = async (documentId) => {
        if (window.confirm('Are you sure you want to delete this document?')) {
            try {
                await deleteDocument(documentId);
                fetchDocuments();
            } catch (error) {
                console.error('Delete failed:', error);
            }
        }
    };

    const handleDownloadDocument = async (documentId) => {
        try {
            const { downloadUrl, fileName } = await downloadDocument(documentId);
            // Open in new tab
            window.open(downloadUrl, '_blank');
        } catch (error) {
            console.error('Download failed:', error);
        }
    };

    const handleViewDocument = async (document) => {
        try {
            const { viewUrl, fileType } = await fetchViewDocument(document._id || document.id);
            setViewedDocument({ ...document, url: viewUrl, type: fileType });
            setShowViewModal(true);
        } catch (error) {
            console.error('View failed:', error);
            alert('Failed to load document preview');
        }
    };

    const getViewerSrc = (doc) => {
        if (!doc || !doc.url) return '';
        const isPdf = doc.type === 'PDF' || doc.name?.toLowerCase().endsWith('.pdf');
        if (isPdf) {
            // Use Google Docs Viewer to ensure inline rendering for PDFs
            const encoded = encodeURIComponent(doc.url);
            return `https://docs.google.com/gview?url=${encoded}&embedded=true`;
        }
        return doc.url;
    };

    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    return (
        <>
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
                                <button
                                    onClick={openUploadModal}
                                    className="bg-[#00796b] text-white px-6 py-3 rounded-lg font-semibold hover:bg-[#004d40] transition-colors duration-200 flex items-center gap-2"
                                >
                                    <span className="material-symbols-outlined">upload</span>
                                    Upload Documents
                                </button>
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
                                    <div key={document._id || document.id || document.name} className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
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
                                                            {document.uploadDate ? new Date(document.uploadDate).toISOString().split('T')[0] : '—'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <button 
                                                    onClick={() => handleViewDocument(document)}
                                                    className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                    title="View document"
                                                >
                                                    <span className="material-symbols-outlined">visibility</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDownloadDocument(document._id || document.id)}
                                                    className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                >
                                                    <span className="material-symbols-outlined">download</span>
                                                </button>
                                                <button className="p-2 text-gray-500 hover:text-[#00796b] hover:bg-gray-100 rounded-lg transition-colors duration-200">
                                                    <span className="material-symbols-outlined">share</span>
                                                </button>
                                                <button
                                                    onClick={() => handleDeleteDocument(document._id || document.id)}
                                                    className="p-2 text-gray-500 hover:text-red-500 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                                                >
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

            {/* Upload Modal */}
            {showUploadModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-md w-full">
                        {/* Modal Header */}
                        <div className="bg-[#00796b] text-white p-6 rounded-t-lg flex items-center justify-between">
                            <h2 className="text-xl font-bold flex items-center gap-2">
                                <span className="material-symbols-outlined">upload_file</span>
                                Upload Document
                            </h2>
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setUploadError('');
                                }}
                                className="text-white hover:bg-[#004d40] p-1 rounded transition-colors"
                            >
                                <span className="material-symbols-outlined">close</span>
                            </button>
                        </div>

                        {/* Modal Body */}
                        <div className="p-6 space-y-4">
                            {/* Error Message */}
                            {uploadError && (
                                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="text-sm">{uploadError}</p>
                                </div>
                            )}

                            {/* Category Dropdown */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-2">
                                    <span className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-base">category</span>
                                        Select Category
                                    </span>
                                </label>
                                <select
                                    value={selectedUploadCategory}
                                    onChange={(e) => setSelectedUploadCategory(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00796b] focus:border-transparent bg-white"
                                >
                                    {categories.filter(cat => cat.id !== 'all').map(category => (
                                        <option key={category.id} value={category.id}>
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* File Display */}
                            {selectedFile && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm font-medium text-gray-700 mb-1">Selected File:</p>
                                    <div className="flex items-center gap-2">
                                        <span className="material-symbols-outlined text-blue-600">description</span>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-600 truncate">{selectedFile.name}</p>
                                            <p className="text-xs text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* File Upload Input */}
                            <div>
                                <label
                                    htmlFor="modalFileInput"
                                    className="block w-full border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-[#00796b] hover:bg-[#f5f7fa] transition-colors"
                                >
                                    <span className="material-symbols-outlined text-4xl text-gray-400 block mb-2">cloud_upload</span>
                                    <p className="text-sm font-medium text-gray-700">Choose a file or drag it here</p>
                                    <p className="text-xs text-gray-500 mt-1">PDF, DOCX, PPTX, TXT, XLSX up to 50MB</p>
                                </label>
                                <input
                                    type="file"
                                    id="modalFileInput"
                                    accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.xlsx"
                                    onChange={(e) => {
                                        const files = e.target.files;
                                        if (files && files.length > 0) {
                                            setSelectedFile(files[0]);
                                            setUploadError('');
                                        }
                                    }}
                                    className="hidden"
                                />
                            </div>

                            {/* Upload Progress */}
                            {isUploading && (
                                <div className="bg-gray-50 rounded-lg p-4">
                                    <div className="flex items-center gap-3 mb-2">
                                        <span className="material-symbols-outlined text-[#00796b] animate-spin">sync</span>
                                        <p className="text-sm font-medium text-gray-700">Uploading...</p>
                                    </div>
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-[#00796b] h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${uploadProgress}%` }}
                                        ></div>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-2 text-right">{uploadProgress}%</p>
                                </div>
                            )}
                        </div>

                        {/* Modal Footer */}
                        <div className="bg-gray-50 px-6 py-4 rounded-b-lg flex gap-3 justify-end">
                            <button
                                onClick={() => {
                                    setShowUploadModal(false);
                                    setSelectedFile(null);
                                    setUploadError('');
                                }}
                                disabled={isUploading}
                                className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUploadSubmit}
                                disabled={isUploading || !selectedFile}
                                className="px-6 py-2 bg-[#00796b] text-white rounded-lg hover:bg-[#004d40] transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium flex items-center gap-2"
                            >
                                <span className="material-symbols-outlined">upload</span>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* View Document Modal */}
            {showViewModal && viewedDocument && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg shadow-2xl max-w-6xl w-full h-[90vh] flex flex-col">
                        {/* Modal Header */}
                        <div className="bg-[#00796b] text-white p-4 rounded-t-lg flex items-center justify-between">
                            <h2 className="text-lg font-bold flex items-center gap-2 truncate">
                                <span className="material-symbols-outlined">visibility</span>
                                {viewedDocument.name}
                            </h2>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => handleDownloadDocument(viewedDocument._id || viewedDocument.id)}
                                    className="text-white hover:bg-[#004d40] p-2 rounded transition-colors"
                                    title="Download"
                                >
                                    <span className="material-symbols-outlined">download</span>
                                </button>
                                <button
                                    onClick={() => {
                                        setShowViewModal(false);
                                        setViewedDocument(null);
                                    }}
                                    className="text-white hover:bg-[#004d40] p-2 rounded transition-colors"
                                    title="Close"
                                >
                                    <span className="material-symbols-outlined">close</span>
                                </button>
                            </div>
                        </div>

                        {/* Modal Body - Document Viewer */}
                        <div className="flex-1 overflow-hidden bg-gray-100">
                            {viewedDocument.type === 'PDF' || viewedDocument.name?.toLowerCase().endsWith('.pdf') ? (
                                <iframe
                                    src={getViewerSrc(viewedDocument)}
                                    className="w-full h-full border-0"
                                    title="Document viewer"
                                />
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full p-8">
                                    <span className="material-symbols-outlined text-6xl text-gray-400 mb-4">
                                        {viewedDocument.type === 'DOCX' ? 'description' :
                                         viewedDocument.type === 'PPTX' ? 'slideshow' : 'insert_drive_file'}
                                    </span>
                                    <h3 className="text-xl font-semibold text-gray-700 mb-2">Preview not available</h3>
                                    <p className="text-gray-600 mb-4">This file type cannot be previewed in the browser.</p>
                                    <div className="flex gap-3">
                                        <button
                                            onClick={() => handleDownloadDocument(viewedDocument._id || viewedDocument.id)}
                                            className="bg-[#00796b] text-white px-6 py-2 rounded-lg hover:bg-[#004d40] transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">download</span>
                                            Download to View
                                        </button>
                                        <button
                                            onClick={() => window.open(viewedDocument.url, '_blank')}
                                            className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition-colors flex items-center gap-2"
                                        >
                                            <span className="material-symbols-outlined">open_in_new</span>
                                            Open in New Tab
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default DocumentLibrary;
