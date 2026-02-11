import axios from 'axios';

/**
 * API Service
 * Handles all HTTP communication with backend
 */

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear auth on unauthorized
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

/**
 * Authentication APIs
 */
export const authAPI = {
  register: async (username, email, password) => {
    const response = await apiClient.post('/auth/register', {
      username,
      email,
      password
    });
    return response.data;
  },

  login: async (email, password) => {
    const response = await apiClient.post('/auth/login', {
      email,
      password
    });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  }
};

/**
 * User APIs
 */
export const userAPI = {
  listUsers: async () => {
    const response = await apiClient.get('/users');
    return response.data;
  },

  searchUsers: async (query) => {
    const response = await apiClient.get('/users/search', {
      params: { q: query }
    });
    return response.data;
  },

  getOnlineUsers: async () => {
    const response = await apiClient.get('/users/online');
    return response.data;
  },

  getUser: async (userId) => {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  },

  getConversation: async (userId) => {
    const response = await apiClient.get(`/users/${userId}/conversation`);
    return response.data;
  },

  getConversations: async () => {
    const response = await apiClient.get('/users/conversations');
    return response.data;
  }
};

/**
 * Message APIs
 */
export const messageAPI = {
  sendMessage: async (receiverId, content) => {
    const response = await apiClient.post('/messages', {
      receiver_id: receiverId,
      content
    });
    return response.data;
  },

  getConversationMessages: async (userId) => {
    const response = await apiClient.get(`/messages/conversation/${userId}`);
    return response.data;
  },

  markMessageAsSeen: async (messageId) => {
    const response = await apiClient.put(`/messages/${messageId}/seen`);
    return response.data;
  }
};

export default apiClient;
