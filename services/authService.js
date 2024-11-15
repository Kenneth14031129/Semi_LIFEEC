// services/AuthService.js

import axios from "axios";

const API_URL = "http://localhost:3000/api/v1/auth";

const AuthService = {
  // Log in and store the user data in localStorage
  login: async (email, password) => {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    if (response.data.token && response.data.user) {
      const { token, user } = response.data;
      localStorage.setItem("authToken", JSON.stringify(token));
      localStorage.setItem("userId", JSON.stringify(user._id));
      return { token, user };
    }
    throw new Error("Login failed. Please check your credentials.");
  },

  // Log out and clear localStorage
  logout: () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  },

  // Check if user is already authenticated
  isAuthenticated: () => {
    const token = JSON.parse(localStorage.getItem("authToken"));
    const userId = JSON.parse(localStorage.getItem("userId"));
    return !!token && !!userId;
  },

  // Get the logged-in user ID
  getUserId: () => {
    return JSON.parse(localStorage.getItem("userId"));
  },

  // Get the token
  getAuthToken: () => {
    return JSON.parse(localStorage.getItem("authToken"));
  }
};

export default AuthService;
