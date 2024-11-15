// src/api/api.js

const BASE_URL = window.location.origin.includes('localhost') 
  ? 'http://localhost:3000/api/v1'
  : 'https://semi-lifeec.onrender.com/api/v1';

export const api = {
  get: async (endpoint) => {
    const response = await fetch(`${BASE_URL}${endpoint}`);
    if (!response.ok) throw new Error(response.statusText);
    return response.json();
  }
};