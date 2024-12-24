const BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api/v1'
  : 'https://semi-lifeec.onrender.com/api/v1';

import AuthService from './authService';  // Add this import

export const api = {
  get: async (endpoint) => {
    const token = AuthService.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include'  // Add this for cookies if needed
    });

    if (response.status === 401) {
      AuthService.logout();  // Clear invalid tokens
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return response.json();
  },
  
  post: async (endpoint, data) => {
    const token = AuthService.getAuthToken();
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      credentials: 'include',  // Add this for cookies if needed
      body: JSON.stringify(data),
    });

    if (response.status === 401) {
      AuthService.logout();  // Clear invalid tokens
      throw new Error('Authentication expired');
    }

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || response.statusText);
    }

    return response.json();
  }
};