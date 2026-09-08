import api from './api';
import { getStoredRecords, saveStoredRecords } from './mockData';

export const medicalRecordService = {
  getAll: async (params = {}) => {
    try {
      const response = await api.get('/medical-records', { params });
      if (response.data && response.data.items) return response.data;
    } catch (e) { /* fallback below */ }

    let list = [...getStoredRecords()];
    const { search, gender, bloodGroup, department, status, sortBy = 'createdAt', sortOrder = 'desc', page = 1, pageSize = 10 } = params;

    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        r.patientName.toLowerCase().includes(s) ||
        r.patientId.toLowerCase().includes(s) ||
        r.diagnosis.toLowerCase().includes(s) ||
        r.doctorName.toLowerCase().includes(s)
      );
    }
    if (gender) list = list.filter(r => r.gender.toLowerCase() === gender.toLowerCase());
    if (bloodGroup) list = list.filter(r => r.bloodGroup.toLowerCase() === bloodGroup.toLowerCase());
    if (department) list = list.filter(r => r.department.toLowerCase() === department.toLowerCase());
    if (status) list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());

    list.sort((a, b) => {
      const valA = a[sortBy] ?? '';
      const valB = b[sortBy] ?? '';
      if (sortOrder === 'asc') return valA > valB ? 1 : -1;
      return valA < valB ? 1 : -1;
    });

    const totalCount = list.length;
    const items = list.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      totalCount,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(totalCount / pageSize)
    };
  },

  getById: async (id) => {
    try {
      const response = await api.get(`/medical-records/${id}`);
      if (response.data && response.data.id) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    return list.find(r => r.id === Number(id)) || null;
  },

  getStats: async () => {
    try {
      const response = await api.get('/medical-records/stats');
      if (response.data && response.data.totalRecords !== undefined) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const depts = new Set(list.map(r => r.department));
    return {
      totalRecords: list.length,
      activePatients: list.filter(r => r.status === 'Active').length,
      completedCases: list.filter(r => r.status === 'Completed').length,
      dischargedPatients: list.filter(r => r.status === 'Discharged').length,
      pendingCases: list.filter(r => r.status === 'Pending').length,
      totalDepartments: depts.size
    };
  },

  create: async (data) => {
    try {
      const response = await api.post('/medical-records', data);
      if (response.data && response.data.id) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const newId = list.length > 0 ? Math.max(...list.map(r => r.id)) + 1 : 1;
    const record = {
      ...data,
      id: newId,
      createdBy: 'subadmin',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    list.unshift(record);
    saveStoredRecords(list);
    return record;
  },

  update: async (id, data) => {
    try {
      const response = await api.put(`/medical-records/${id}`, data);
      if (response.data && response.data.id) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const idx = list.findIndex(r => r.id === Number(id));
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...data, updatedAt: new Date().toISOString() };
      saveStoredRecords(list);
      return list[idx];
    }
    return null;
  },

  delete: async (id) => {
    try {
      const response = await api.delete(`/medical-records/${id}`);
      if (response.status === 200) return true;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const filtered = list.filter(r => r.id !== Number(id));
    saveStoredRecords(filtered);
    return true;
  },

  getPatients: async (params = {}) => {
    try {
      const response = await api.get('/medical-records/patients', { params });
      if (response.data && response.data.items) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const groups = {};
    for (const r of list) {
      if (!groups[r.patientId]) {
        groups[r.patientId] = [];
      }
      groups[r.patientId].push(r);
    }

    let patientSummaries = Object.keys(groups).map(pid => {
      const recs = groups[pid];
      recs.sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate));
      const latest = recs[0];
      return {
        patientId: pid,
        patientName: latest.patientName,
        age: latest.age,
        gender: latest.gender,
        bloodGroup: latest.bloodGroup,
        recordCount: recs.length,
        latestAdmissionDate: latest.admissionDate,
        latestStatus: latest.status,
        latestDiagnosis: latest.diagnosis,
        latestDoctor: latest.doctorName,
        department: latest.department
      };
    });

    const { search, page = 1, pageSize = 8 } = params;
    if (search) {
      const s = search.toLowerCase();
      patientSummaries = patientSummaries.filter(p =>
        p.patientName.toLowerCase().includes(s) ||
        p.patientId.toLowerCase().includes(s) ||
        p.latestDiagnosis.toLowerCase().includes(s) ||
        p.latestDoctor.toLowerCase().includes(s)
      );
    }

    const totalCount = patientSummaries.length;
    const items = patientSummaries.slice((page - 1) * pageSize, page * pageSize);
    return {
      items,
      totalCount,
      page: Number(page),
      pageSize: Number(pageSize),
      totalPages: Math.ceil(totalCount / pageSize)
    };
  },

  getPatientHistory: async (patientId) => {
    try {
      const response = await api.get(`/medical-records/patients/${patientId}`);
      if (response.data && response.data.records) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const records = list
      .filter(r => r.patientId.toLowerCase() === patientId.toLowerCase())
      .sort((a, b) => new Date(b.admissionDate) - new Date(a.admissionDate));

    if (records.length === 0) return null;
    const latest = records[0];
    return {
      summary: {
        patientId: latest.patientId,
        patientName: latest.patientName,
        age: latest.age,
        gender: latest.gender,
        bloodGroup: latest.bloodGroup,
        recordCount: records.length,
        latestAdmissionDate: latest.admissionDate,
        latestStatus: latest.status,
        latestDiagnosis: latest.diagnosis,
        latestDoctor: latest.doctorName,
        department: latest.department
      },
      records
    };
  },

  getAnalytics: async () => {
    try {
      const response = await api.get('/medical-records/analytics');
      if (response.data && response.data.totalRecords !== undefined) return response.data;
    } catch (e) { /* fallback */ }

    const list = getStoredRecords();
    const total = list.length;
    const patients = new Set(list.map(r => r.patientId));

    const calcDistribution = (field) => {
      const counts = {};
      list.forEach(r => { counts[r[field]] = (counts[r[field]] || 0) + 1; });
      return Object.keys(counts)
        .map(name => ({
          name,
          count: counts[name],
          percentage: total > 0 ? Math.round((counts[name] / total) * 1000) / 10 : 0
        }))
        .sort((a, b) => b.count - a.count);
    };

    const ageBrackets = [
      { name: "0-18 (Pediatric)", count: list.filter(r => r.age <= 18).length },
      { name: "19-35 (Young Adult)", count: list.filter(r => r.age >= 19 && r.age <= 35).length },
      { name: "36-50 (Middle Age)", count: list.filter(r => r.age >= 36 && r.age <= 50).length },
      { name: "51-65 (Mature Adult)", count: list.filter(r => r.age >= 51 && r.age <= 65).length },
      { name: "65+ (Senior)", count: list.filter(r => r.age > 65).length }
    ];
    ageBrackets.forEach(a => {
      a.percentage = total > 0 ? Math.round((a.count / total) * 1000) / 10 : 0;
    });

    return {
      totalRecords: total,
      totalPatients: patients.size,
      activeCases: list.filter(r => r.status === 'Active').length,
      completedCases: list.filter(r => r.status === 'Completed').length,
      dischargedCases: list.filter(r => r.status === 'Discharged').length,
      pendingCases: list.filter(r => r.status === 'Pending').length,
      departmentDistribution: calcDistribution('department'),
      statusDistribution: calcDistribution('status'),
      genderDistribution: calcDistribution('gender'),
      bloodGroupDistribution: calcDistribution('bloodGroup'),
      ageGroupDistribution: ageBrackets
    };
  },

  getExportData: async (params = {}) => {
    try {
      const response = await api.get('/medical-records/export', { params });
      if (response.data && Array.isArray(response.data)) return response.data;
    } catch (e) { /* fallback */ }

    let list = [...getStoredRecords()];
    const { search, department, status } = params;
    if (search) {
      const s = search.toLowerCase();
      list = list.filter(r =>
        r.patientName.toLowerCase().includes(s) ||
        r.patientId.toLowerCase().includes(s) ||
        r.diagnosis.toLowerCase().includes(s) ||
        r.doctorName.toLowerCase().includes(s)
      );
    }
    if (department) list = list.filter(r => r.department.toLowerCase() === department.toLowerCase());
    if (status) list = list.filter(r => r.status.toLowerCase() === status.toLowerCase());
    return list;
  },
};
