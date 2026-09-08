import api from './api';
import { getStoredUsers } from './mockData';

export const authService = {
  login: async (username, password) => {
    try {
      const response = await api.post('/auth/login', { username, password });
      // If server returned valid JSON object with token
      if (response.data && response.data.token) {
        return response.data;
      }
    } catch (err) {
      // If it was a real 400 with invalid credentials from live backend, rethrow
      if (err.response?.status === 400 && err.response?.data?.message) {
        throw err;
      }
      // Otherwise live API server is not reachable on this host (e.g. Netlify)
    }

    // Fallback authentication for standalone / Netlify deployment
    const users = getStoredUsers();
    const found = users.find(u => u.username.toLowerCase() === username.trim().toLowerCase());
    if (found && found.password === password) {
      const mockToken = `mock-jwt-token-${found.username}-${Date.now()}`;
      return {
        token: mockToken,
        user: {
          id: found.id,
          username: found.username,
          fullName: found.fullName,
          role: found.role,
          email: found.email,
          phone: found.phone,
          profileImageUrl: found.profileImageUrl || null,
          permissions: found.permissions
        }
      };
    }

    const err = new Error('Invalid username or password.');
    err.response = { data: { message: 'Invalid username or password.' } };
    throw err;
  },

  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  getToken: () => {
    return localStorage.getItem('token');
  },

  getUser: () => {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  setAuth: (token, user) => {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  isAuthenticated: () => {
    return !!localStorage.getItem('token');
  },
};
