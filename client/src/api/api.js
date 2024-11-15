const BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api/v1'
  : '/api/v1';

export const api = {
  get: async (endpoint) => {
    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        }
      });
      if (!response.ok) throw new Error(response.statusText);
      return response.json();
    } catch (error) {
      console.error(`API Error (${endpoint}):`, error);
      throw error;
    }
  }
};