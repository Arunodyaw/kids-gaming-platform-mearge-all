// src/services/api.js
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

class ApiService {
  constructor() {
    this.token = localStorage.getItem('token');
  }

  getHeaders() {
  const headers = { 'Content-Type': 'application/json' };
  const token = localStorage.getItem('token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  try {
    const response = await fetch(url, { ...options, headers: this.getHeaders() });
    const data = await response.json();

    if (response.status === 401) {
      // Token invalid/expired – clear storage and redirect
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      throw new Error(data.message || 'Session expired');
    }

    if (!response.ok) {
      throw new Error(data.message || 'API request failed');
    }
    return data;
  } catch (error) {
    console.error('❌ API Error:', error);
    throw error;
  }
}

  // ========== GAME ENDPOINTS ==========
  async saveGameSession(gameData) {
    return this.request('/games/save', {
      method: 'POST',
      body: JSON.stringify(gameData),
    });
  }

  async getGameSessions(childId, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    return this.request(`/games/sessions/${childId}?${queryString}`);
  }

  async getGameStats(childId) {
    return this.request(`/games/stats/${childId}`);
  }

  async getRecentGames(childId, limit = 5) {
    return this.request(`/games/recent/${childId}?limit=${limit}`);
  }

  // ========== CHILD ENDPOINTS ==========
  async getChildren() {
    return this.request('/children');
  }

  async createChild(childData) {
    return this.request('/children', {
      method: 'POST',
      body: JSON.stringify(childData),
    });
  }
}

export default new ApiService();