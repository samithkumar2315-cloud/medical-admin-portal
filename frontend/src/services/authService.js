import api from './api';
import { getStoredUsers } from './mockData';

export const authService = {
  login: async (username, password) => {
    const trimmedUsername = (username || '').trim().toLowerCase();
    const cleanPassword = (password || '').trim();

    // 1. First try live backend if it responds quickly
    try {
      const response = await api.post(
        '/auth/login',
        { username: (username || '').trim(), password },
        { timeout: 2500 }
      );
      if (response && response.data && typeof response.data === 'object' && response.data.token) {
        return response.data;
      }
    } catch (err) {
      // If live backend explicitly returned 400 with a validation error, only rethrow if not on standalone host
      if (err.response && typeof err.response.data === 'object' && err.response.data?.message && err.response.status === 400) {
        // live backend reached and rejected
        throw err;
      }
    }

    // 2. Direct hardcoded guarantee for default demo credentials (immediate on Netlify)
    if (trimmedUsername === 'admin' && (cleanPassword === 'Admin@123' || password === 'Admin@123')) {
      return {
        token: `demo-token-admin-${Date.now()}`,
        user: {
          id: 1,
          username: "admin",
          fullName: "System Administrator",
          role: "Administrator",
          email: "admin@medportal.com",
          phone: "+1-555-0100",
          permissions: [
            "VIEW_MEDICAL_DATA",
            "SEARCH_FILTER_SORT",
            "VIEW_RECORD_DETAILS",
            "UPDATE_OWN_PROFILE",
            "CHANGE_PASSWORD"
          ]
        }
      };
    }

    if (trimmedUsername === 'subadmin' && (cleanPassword === 'SubAdmin@123' || password === 'SubAdmin@123')) {
      return {
        token: `demo-token-subadmin-${Date.now()}`,
        user: {
          id: 2,
          username: "subadmin",
          fullName: "Sup Administrator",
          role: "SubAdministrator",
          email: "subadmin@medportal.com",
          phone: "+1-555-0200",
          permissions: [
            "VIEW_MEDICAL_DATA",
            "SEARCH_FILTER_SORT",
            "VIEW_RECORD_DETAILS",
            "CREATE_MEDICAL_DATA",
            "EDIT_MEDICAL_DATA",
            "DELETE_MEDICAL_DATA",
            "UPDATE_OWN_PROFILE",
            "CHANGE_PASSWORD"
          ]
        }
      };
    }

    // 3. Check dynamically registered staff accounts in localStorage
    const users = getStoredUsers();
    const found = users.find(u => u.username.toLowerCase() === trimmedUsername);
    if (found && (found.password === password || found.password === cleanPassword)) {
      return {
        token: `demo-token-${found.username}-${Date.now()}`,
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
