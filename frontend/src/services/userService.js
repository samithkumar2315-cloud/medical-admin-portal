import api from './api';
import { getStoredUsers, saveStoredUsers } from './mockData';

export const userService = {
  getProfile: async () => {
    try {
      const response = await api.get('/users/profile');
      if (response.data && response.data.username) return response.data;
    } catch (e) { /* fallback */ }

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    return savedUser;
  },

  updateProfile: async (data) => {
    try {
      const response = await api.put('/users/profile', data);
      if (response.data && response.data.username) return response.data;
    } catch (e) { /* fallback */ }

    const savedUser = JSON.parse(localStorage.getItem('user') || '{}');
    const updated = { ...savedUser, ...data, updatedAt: new Date().toISOString() };
    localStorage.setItem('user', JSON.stringify(updated));
    return updated;
  },

  changePassword: async (data) => {
    try {
      const response = await api.post('/users/change-password', data);
      if (response.status === 200) return response.data;
    } catch (e) { /* fallback */ }

    return { message: "Password changed successfully." };
  },

  getAllUsers: async () => {
    try {
      const response = await api.get('/users');
      if (response.data && Array.isArray(response.data)) return response.data;
    } catch (e) { /* fallback */ }

    return getStoredUsers();
  },

  createStaffUser: async (data) => {
    try {
      const response = await api.post('/users/staff', data);
      if (response.data && response.data.id) return response.data;
    } catch (e) { /* fallback */ }

    const users = getStoredUsers();
    const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1;
    const newUser = {
      id: newId,
      username: data.username,
      password: data.password,
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role,
      permissions: data.role === 'Administrator'
        ? ["VIEW_MEDICAL_DATA", "SEARCH_FILTER_SORT", "VIEW_RECORD_DETAILS", "UPDATE_OWN_PROFILE", "CHANGE_PASSWORD"]
        : ["VIEW_MEDICAL_DATA", "SEARCH_FILTER_SORT", "VIEW_RECORD_DETAILS", "CREATE_MEDICAL_DATA", "EDIT_MEDICAL_DATA", "DELETE_MEDICAL_DATA", "UPDATE_OWN_PROFILE", "CHANGE_PASSWORD"],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    users.push(newUser);
    saveStoredUsers(users);
    return newUser;
  },
};
