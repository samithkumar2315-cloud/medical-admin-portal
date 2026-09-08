import api from './api';

export const medicalRecordService = {
  getAll: async (params = {}) => {
    const response = await api.get('/medical-records', { params });
    return response.data;
  },

  getById: async (id) => {
    const response = await api.get(`/medical-records/${id}`);
    return response.data;
  },

  getStats: async () => {
    const response = await api.get('/medical-records/stats');
    return response.data;
  },

  create: async (data) => {
    const response = await api.post('/medical-records', data);
    return response.data;
  },

  update: async (id, data) => {
    const response = await api.put(`/medical-records/${id}`, data);
    return response.data;
  },

  delete: async (id) => {
    const response = await api.delete(`/medical-records/${id}`);
    return response.data;
  },

  getPatients: async (params = {}) => {
    const response = await api.get('/medical-records/patients', { params });
    return response.data;
  },

  getPatientHistory: async (patientId) => {
    const response = await api.get(`/medical-records/patients/${patientId}`);
    return response.data;
  },

  getAnalytics: async () => {
    const response = await api.get('/medical-records/analytics');
    return response.data;
  },

  getExportData: async (params = {}) => {
    const response = await api.get('/medical-records/export', { params });
    return response.data;
  },
};
