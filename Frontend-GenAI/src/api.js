 import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chat';  // Ensure this is the correct URL of your FastAPI server
const BACKEND_URL = 'http://localhost:3001';

// Get JWT token from localStorage
const getAuthHeaders = () => {
    const token = localStorage.getItem('jwtToken');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Get company ID from user_details
export const getCompanyId = () => {
    const userDetails = localStorage.getItem('user_details');
    if (userDetails) {
        const user = JSON.parse(userDetails);
        return user.companyId || 1;
    }
    return 1;
};

// Get user details from localStorage
export const getUserDetails = () => {
    const userDetails = localStorage.getItem('user_details');
    if (userDetails) {
        return JSON.parse(userDetails);
    }
    return null;
};

// Team Chat API - Get chat history
export const getTeamChatHistory = async () => {
    try {
        const response = await axios.get(`${BACKEND_URL}/team-chat/history`, {
            headers: getAuthHeaders()
        });
        return response.data.messages;
    } catch (error) {
        console.error('Error fetching team chat history:', error);
        throw error;
    }
};

// Private Chat API - Get chat history with another user
export const getPrivateChatHistory = async (otherUserId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/team-chat/private/history/${otherUserId}`, {
            headers: getAuthHeaders()
        });
        return response.data.messages;
    } catch (error) {
        console.error('Error fetching private chat history:', error);
        throw error;
    }
};

export const sendPrompt = async (prompt) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/issue/chat`, {
            userMessage: prompt
        }, {
            headers: getAuthHeaders()
        });
        return response.data.botResponse;
    } catch (error) {
        console.error('Error sending prompt:', error);
        throw error;
    }
};

// Chat API - calls backend endpoint which stores history and calls Python API
export const sendChat = async (userMessage) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/issue/chat`, {
            userMessage
        }, {
            headers: getAuthHeaders()
        });
        return response.data.botResponse;
    } catch (error) {
        console.error('Error sending chat message:', error);
        throw error;
    }
};

// Authentication APIs
export const loginUser = async (email, password) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/login`, {
            email,
            password
        });
        return response.data;
    } catch (error) {
        console.error('Error during login:', error);
        throw error;
    }
};

export const companySignup = async (companyData) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/company-signup`, companyData);
        return response.data;
    } catch (error) {
        console.error('Error during company signup:', error);
        throw error;
    }
};

// Document Upload API
export const uploadDocument = async (file, category) => {
    try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('category', category);
        formData.append('uploadedBy', localStorage.getItem('username') || 'Admin');
        
        const response = await axios.post(`${BACKEND_URL}/document/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                ...getAuthHeaders()
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading document:', error);
        throw error;
    }
};

// List Documents API
export const listDocuments = async (category = 'all', search = '') => {
    try {
        const params = new URLSearchParams();
        if (category && category !== 'all') {
            params.append('category', category);
        }
        if (search) {
            params.append('search', search);
        }
        
        const response = await axios.get(`${BACKEND_URL}/document/list?${params.toString()}`, {
            headers: getAuthHeaders()
        });
        return response.data.documents || [];
    } catch (error) {
        console.error('Error listing documents:', error);
        throw error;
    }
};

// Download Document API
export const downloadDocument = async (documentId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/document/download/${documentId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
};

// Delete Document API
export const deleteDocument = async (documentId) => {
    try {
        const response = await axios.delete(`${BACKEND_URL}/document/${documentId}`, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error deleting document:', error);
        throw error;
    }
};
// User Management APIs
export const createUser = async (companyId, name, email, password, role) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/auth/create-user`, {
            companyId,
            name,
            email,
            password,
            role
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const listUsersByCompany = async (companyId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/auth/users/${companyId}`, {
            headers: getAuthHeaders()
        });
        return response.data.users || [];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

// Role Management APIs
export const createRole = async (companyId, name, description, permissions, color) => {
    try {
        const response = await axios.post(`${BACKEND_URL}/role/create`, {
            company_id: companyId,
            name,
            description,
            permissions,
            color
        }, {
            headers: getAuthHeaders()
        });
        return response.data;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};

export const listRolesByCompany = async (companyId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/role/list/${companyId}`, {
            headers: getAuthHeaders()
        });
        return response.data.roles || [];
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};

// PDF Upload API (Admin)
export const uploadPDF = async (file) => {
    try {
        const formData = new FormData();
        formData.append('pdf', file);
        
        const response = await axios.post(`${BACKEND_URL}/upload-pdf`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading PDF:', error);
        throw error;
    }
};