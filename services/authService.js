//authService.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

// Custom error class for authentication errors
class AuthError extends Error {
  constructor(message, code = 'AUTH_ERROR') {
    super(message);
    this.name = 'AuthError';
    this.code = code;
  }
}

const AuthService = {
  login: async (email, password) => {
    try {
      // Validate inputs before making request
      if (!email || !password) {
        throw new AuthError('Email and password are required', 'VALIDATION_ERROR');
      }

      const response = await axios.post(`${API_URL}/login`, { email, password }, {
        timeout: 10000, // 10 second timeout
        validateStatus: status => status < 500 // Handle 4xx errors in response data
      });

      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        
        // Validate user type before proceeding
        if (!['Admin', 'Owner'].includes(user.userType)) {
          throw new AuthError('Access denied: Only Admin and Owner can log in.', 'UNAUTHORIZED_ROLE');
        }

        // Store auth data
        localStorage.setItem("authToken", JSON.stringify(token));
        localStorage.setItem("userId", JSON.stringify(user._id));
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set Authorization header
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { token, user };
      }
      
      throw new AuthError('Invalid server response: Missing token or user data', 'INVALID_RESPONSE');
    } catch (err) {
      // Clean up any partial data
      AuthService.logout();

      // Handle different types of errors
      if (err instanceof AuthError) {
        throw err;
      }
      
      if (err.code === 'ECONNREFUSED') {
        throw new AuthError('Unable to connect to server. Please check if the server is running.', 'SERVER_UNREACHABLE');
      }
      
      if (err.code === 'ECONNABORTED') {
        throw new AuthError('Request timed out. Please try again.', 'REQUEST_TIMEOUT');
      }

      if (err.response) {
        // Handle specific HTTP error responses
        switch (err.response.status) {
          case 401:
            throw new AuthError('Invalid credentials', 'INVALID_CREDENTIALS');
          case 403:
            throw new AuthError('Account locked or disabled', 'ACCOUNT_LOCKED');
          case 404:
            throw new AuthError('Login service not found', 'SERVICE_NOT_FOUND');
          default:
            throw new AuthError(
              err.response.data?.message || 'Authentication failed',
              'AUTH_FAILED'
            );
        }
      }

      throw new AuthError('Network error occurred', 'NETWORK_ERROR');
    }
  },

  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
    localStorage.removeItem("user");
    delete axios.defaults.headers.common['Authorization'];
  },

  isAuthenticated: () => {
    try {
      const token = JSON.parse(localStorage.getItem("authToken"));
      const user = JSON.parse(localStorage.getItem("user"));
      return !!(token && user?.userType && ['Admin', 'Owner'].includes(user.userType));
    } catch {
      return false;
    }
  },

  getAuthToken: () => {
    try {
      return JSON.parse(localStorage.getItem("authToken"));
    } catch {
      return null;
    }
  },

  getUser: () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  }
};

export default AuthService;