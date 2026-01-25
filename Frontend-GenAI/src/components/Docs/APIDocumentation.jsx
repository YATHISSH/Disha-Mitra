import { useNavigate } from 'react-router-dom';

const APIDocumentation = () => {
    const navigate = useNavigate();

    const endpoints = [
        {
            title: 'Send Chat Message',
            method: 'POST',
            path: '/api/v1/chat',
            permission: 'chat',
            description: 'Send a message to the AI chatbot and get a response. Supports both creating new sessions and continuing existing ones.',
            request: {
                headers: {
                    'X-API-Key': 'your_api_key_here',
                    'Content-Type': 'application/json'
                },
                body: {
                    message: 'What is the company policy?',
                    sessionId: null // Optional - auto-creates if missing
                }
            },
            response: {
                message: 'Chat processed successfully',
                botResponse: 'The company policy...',
                chatId: 10,
                sessionId: 0
            },
            example: `curl -X POST http://localhost:3001/api/v1/chat \\
  -H "X-API-Key: your_api_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "What is the company policy?", "sessionId": 0}'`
        },
        {
            title: 'Upload Document',
            method: 'POST',
            path: '/api/v1/upload',
            permission: 'upload',
            description: 'Upload and index a PDF document. The document is automatically processed and vectors are created for semantic search.',
            request: {
                headers: {
                    'X-API-Key': 'your_api_key_here'
                },
                body: 'multipart/form-data with file and category'
            },
            response: {
                message: 'Document uploaded successfully',
                document: {
                    _id: 'mongodb_id',
                    name: 'document.pdf',
                    url: 'https://...'
                }
            },
            example: `curl -X POST http://localhost:3001/api/v1/upload \\
  -H "X-API-Key: your_api_key_here" \\
  -F "file=@document.pdf" \\
  -F "category=policies"`
        },
        {
            title: 'List Documents',
            method: 'GET',
            path: '/api/v1/documents',
            permission: 'search',
            description: 'Retrieve a list of all documents for the company. Supports filtering by category and search term.',
            request: {
                headers: {
                    'X-API-Key': 'your_api_key_here'
                },
                params: {
                    category: 'policies',
                    search: 'training'
                }
            },
            response: {
                message: 'Documents retrieved successfully',
                documents: [],
                count: 5
            },
            example: `curl -X GET "http://localhost:3001/api/v1/documents?category=policies" \\
  -H "X-API-Key: your_api_key_here"`
        },
        {
            title: 'Delete Document',
            method: 'DELETE',
            path: '/api/v1/documents/:documentId',
            permission: 'delete',
            description: 'Delete a document and remove all associated vectors from Pinecone. This action cannot be undone.',
            request: {
                headers: {
                    'X-API-Key': 'your_api_key_here'
                },
                params: {
                    documentId: 'document_id_here'
                }
            },
            response: {
                message: 'Document deleted successfully'
            },
            example: `curl -X DELETE http://localhost:3001/api/v1/documents/65a1b2c3d4e5f6g7h8i9j0k1 \\
  -H "X-API-Key: your_api_key_here"`
        }
    ];

    const features = [
        {
            icon: 'security',
            title: 'API Key Authentication',
            description: 'All API requests must include a valid X-API-Key header. API keys are scoped to specific companies and permissions.'
        },
        {
            icon: 'speed',
            title: 'Rate Limiting',
            description: 'Each API key has a default rate limit of 100 requests per hour. Contact support to increase limits.'
        },
        {
            icon: 'analytics',
            title: 'Usage Analytics',
            description: 'Track API usage, response times, and error rates through the API Management dashboard.'
        },
        {
            icon: 'storage',
            title: 'Session Management',
            description: 'API chats use session_id=0 for unified history. Continue conversations by providing the sessionId.'
        },
        {
            icon: 'cloud_upload',
            title: 'Document Processing',
            description: 'Uploaded documents are automatically indexed with semantic embeddings for intelligent search and retrieval.'
        },
        {
            icon: 'lock',
            title: 'Data Security',
            description: 'All data is encrypted in transit and scoped to your company. API keys can be revoked instantly.'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#f5f7fa] to-[#c3cfe2] p-6">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button 
                        onClick={() => navigate(-1)}
                        className="text-[#00796b] hover:text-[#004d40] mb-4 flex items-center gap-2"
                    >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back
                    </button>
                    <h1 className="text-4xl font-bold text-[#004d40] mb-2">API Documentation</h1>
                    <p className="text-gray-600">Complete guide to integrate Disha-Mitra AI APIs into your applications</p>
                </div>

                {/* Quick Start */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#004d40] mb-4">Quick Start</h2>
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">1. Create an API Key</h3>
                            <p className="text-gray-600">Go to API Management and click "Create API Key". Configure permissions and save the key securely.</p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">2. Include X-API-Key Header</h3>
                            <p className="text-gray-600">All requests must include: <code className="bg-gray-100 px-2 py-1 rounded">X-API-Key: your_api_key</code></p>
                        </div>
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-2">3. Make Your First Request</h3>
                            <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{`curl -X POST http://localhost:3001/api/v1/chat \\
  -H "X-API-Key: your_api_key" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Hello"}'`}
                            </pre>
                        </div>
                    </div>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {features.map((feature, idx) => (
                        <div key={idx} className="bg-white rounded-lg shadow-lg p-6">
                            <div className="flex items-center gap-3 mb-3">
                                <span className="material-symbols-outlined text-[#00796b] text-2xl">{feature.icon}</span>
                                <h3 className="font-semibold text-[#004d40]">{feature.title}</h3>
                            </div>
                            <p className="text-sm text-gray-600">{feature.description}</p>
                        </div>
                    ))}
                </div>

                {/* Endpoints */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#004d40] mb-8">API Endpoints</h2>
                    <div className="space-y-8">
                        {endpoints.map((endpoint, idx) => (
                            <div key={idx} className="border-l-4 border-[#00796b] pl-6 pb-6 border-b">
                                <div className="flex items-center gap-4 mb-3">
                                    <span className={`px-3 py-1 rounded font-bold text-white text-sm ${
                                        endpoint.method === 'POST' ? 'bg-blue-600' :
                                        endpoint.method === 'GET' ? 'bg-green-600' :
                                        endpoint.method === 'DELETE' ? 'bg-red-600' : 'bg-gray-600'
                                    }`}>
                                        {endpoint.method}
                                    </span>
                                    <code className="bg-gray-100 px-3 py-1 rounded font-mono text-sm">{endpoint.path}</code>
                                    <span className="ml-auto text-xs bg-purple-100 text-purple-700 px-3 py-1 rounded">
                                        Permission: {endpoint.permission}
                                    </span>
                                </div>
                                
                                <h3 className="text-xl font-semibold text-gray-800 mb-2">{endpoint.title}</h3>
                                <p className="text-gray-600 mb-4">{endpoint.description}</p>

                                <div className="grid grid-cols-2 gap-4 mb-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Request</h4>
                                        <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify(endpoint.request, null, 2)}
                                        </pre>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-700 mb-2">Response</h4>
                                        <pre className="bg-gray-50 p-3 rounded text-xs overflow-x-auto">
{JSON.stringify(endpoint.response, null, 2)}
                                        </pre>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-700 mb-2">Example</h4>
                                    <pre className="bg-gray-900 text-green-400 p-4 rounded overflow-x-auto text-sm">
{endpoint.example}
                                    </pre>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Error Codes */}
                <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
                    <h2 className="text-2xl font-bold text-[#004d40] mb-6">Error Codes</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="border-l-4 border-red-500 pl-4">
                            <div className="font-bold text-red-600">401 - Unauthorized</div>
                            <p className="text-sm text-gray-600">Invalid or missing API key</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4">
                            <div className="font-bold text-red-600">403 - Forbidden</div>
                            <p className="text-sm text-gray-600">API key lacks required permissions</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4">
                            <div className="font-bold text-red-600">429 - Rate Limited</div>
                            <p className="text-sm text-gray-600">API key rate limit exceeded</p>
                        </div>
                        <div className="border-l-4 border-red-500 pl-4">
                            <div className="font-bold text-red-600">500 - Server Error</div>
                            <p className="text-sm text-gray-600">Internal server error (contact support)</p>
                        </div>
                    </div>
                </div>

                {/* Best Practices */}
                <div className="bg-blue-50 rounded-lg border border-blue-200 p-8 mb-8">
                    <h2 className="text-2xl font-bold text-blue-900 mb-4">Best Practices</h2>
                    <ul className="space-y-3 text-blue-800">
                        <li className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600">check_circle</span>
                            <span>Store API keys securely - treat them like passwords</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600">check_circle</span>
                            <span>Rotate API keys regularly and revoke unused ones</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600">check_circle</span>
                            <span>Use sessionId to maintain conversation context</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600">check_circle</span>
                            <span>Implement error handling for rate limit (429) responses</span>
                        </li>
                        <li className="flex gap-3">
                            <span className="material-symbols-outlined text-blue-600">check_circle</span>
                            <span>Monitor API usage through the dashboard</span>
                        </li>
                    </ul>
                </div>

                {/* Support */}
                <div className="bg-gradient-to-r from-[#00796b] to-[#004d40] rounded-lg shadow-lg p-8 text-white text-center">
                    <h2 className="text-2xl font-bold mb-2">Need Help?</h2>
                    <p className="mb-4">Check our documentation or contact our support team</p>
                    <button 
                        onClick={() => navigate('/api-management')}
                        className="bg-white text-[#00796b] px-6 py-2 rounded-lg font-semibold hover:bg-gray-100"
                    >
                        Back to API Management
                    </button>
                </div>
            </div>
        </div>
    );
};

export default APIDocumentation;
