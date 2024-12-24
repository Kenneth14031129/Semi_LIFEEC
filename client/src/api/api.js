//api.js

const BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api/v1'
  : 'https://semi-lifeec.onrender.com/api/v1';

  export const api = {
    getHeaders: () => {
      const token = localStorage.getItem('token'); // Or however you store your auth token
      return {
        'Content-Type': 'application/json',
        'Authorization': token ? `Bearer ${token}` : '',
      };
    },
  
    get: async (endpoint) => {
      try {
        const response = await fetch(`${BASE_URL}${endpoint}`, {
          headers: api.getHeaders(),
        });
        
        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.msg || response.statusText);
        }
        
        return response.json();
      } catch (error) {
        console.error(`API GET Error (${endpoint}):`, error);
        throw error;
      }
    },
  
  post: async (endpoint, data) => {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || response.statusText);
    }
    return response.json();
  }
};