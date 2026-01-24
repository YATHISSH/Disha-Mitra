 import axios from 'axios';

const API_URL = 'http://localhost:8000/api/chat';  // Ensure this is the correct URL of your FastAPI server
const BACKEND_URL = 'http://localhost:3001';

export const sendPrompt = async (prompt) => {
    try {
        const response = await axios.post(API_URL, {"userMessage": prompt });
        return response.data.botResponse;
    } catch (error) {
        console.error('Error sending prompt to RAG LLM:', error);
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
        
        const response = await axios.get(`${BACKEND_URL}/document/list?${params.toString()}`);
        return response.data.documents || [];
    } catch (error) {
        console.error('Error listing documents:', error);
        throw error;
    }
};

// Download Document API
export const downloadDocument = async (documentId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/document/download/${documentId}`);
        return response.data;
    } catch (error) {
        console.error('Error downloading document:', error);
        throw error;
    }
};

// Delete Document API
export const deleteDocument = async (documentId) => {
    try {
        const response = await axios.delete(`${BACKEND_URL}/document/${documentId}`);
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
        });
        return response.data;
    } catch (error) {
        console.error('Error creating user:', error);
        throw error;
    }
};

export const listUsersByCompany = async (companyId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/auth/users/${companyId}`);
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
        });
        return response.data;
    } catch (error) {
        console.error('Error creating role:', error);
        throw error;
    }
};

export const listRolesByCompany = async (companyId) => {
    try {
        const response = await axios.get(`${BACKEND_URL}/role/list/${companyId}`);
        return response.data.roles || [];
    } catch (error) {
        console.error('Error fetching roles:', error);
        throw error;
    }
};