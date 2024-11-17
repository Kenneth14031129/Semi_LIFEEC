import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/auth";

const AuthService = {
  login: async (email, password) => {
    try {
      const response = await axios.post(`${API_URL}/login`, { email, password });
      if (response.data.token && response.data.user) {
        const { token, user } = response.data;
        localStorage.setItem("authToken", JSON.stringify(token));
        localStorage.setItem("userId", JSON.stringify(user._id));
        localStorage.setItem("user", JSON.stringify(user));
        
        // Set Authorization header for future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        return { token, user };
      }
      throw new Error("Login failed. Please check your credentials.");
    } catch (err) {
      localStorage.clear(); // Clear any partial data
      delete axios.defaults.headers.common['Authorization'];
      throw new Error(err.response?.data?.message || "Authentication failed");
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
      return !!(token && user && user.userType && 
        (user.userType === "Admin" || user.userType === "Owner"));
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

// Add axios interceptor for token
axios.interceptors.request.use(
  (config) => {
    const token = AuthService.getAuthToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default AuthService;