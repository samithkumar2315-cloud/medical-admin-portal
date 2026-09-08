import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { medicalRecordService } from '../services/medicalRecordService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import DashboardCard from '../components/DashboardCard';
import DataTable from '../components/DataTable';
import SearchBar from '../components/SearchBar';
import AccessBadge from '../components/AccessBadge';
import MedicalRecordModal from '../components/MedicalRecordModal';
import MedicalRecordForm from '../components/MedicalRecordForm';
import ConfirmDialog from '../components/ConfirmDialog';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiFileText, FiUsers, FiCheckCircle, FiGrid, FiPlus, FiDownload } from 'react-icons/fi';

const Dashboard = () => {
  const { user, isSubAdmin } = useAuth();
  const toast = useToast();

  // State
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [stats, setStats] = useState(null);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);

  // Table state
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({});
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Modal state
  const [viewRecord, setViewRecord] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);

  const fetchStats = useCallback(async () => {
    try {
      const data = await medicalRecordService.getStats();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  }, []);

  const fetchRecords = useCallback(async () => {
    try {
      setLoading(true);
      const params = {
        page,
        pageSize,
        sortBy,
        sortOrder,
        ...(search && { search }),
        ...filters,
      };
      const data = await medicalRecordService.getAll(params);
      setRecords(data.items || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load medical records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, pageSize, sortBy, sortOrder, search, filters]);

  useEffect(() => {
    fetchStats();
    fetchRecords();
  }, [fetchStats, fetchRecords]);

  // Debounced search
  useEffect(() => {
    setPage(1);
  }, [search, filters]);

  const handleSort = (column, order) => {
    setSortBy(column);
    setSortOrder(order);
    setPage(1);
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev };
      if (value) next[key] = value;
      else delete next[key];
      return next;
    });
  };

  const handleCreate = async (data) => {
    try {
      setFormLoading(true);
      await medicalRecordService.create(data);
      toast.success('Medical record created successfully.');
      setShowForm(false);
      fetchRecords();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create record.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleUpdate = async (data) => {
    try {
      setFormLoading(true);
      await medicalRecordService.update(editRecord.id, data);
      toast.success('Medical record updated successfully.');
      setEditRecord(null);
      fetchRecords();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update record.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      await medicalRecordService.delete(deleteRecord.id);
      toast.success('Medical record deleted successfully.');
      setDeleteRecord(null);
      fetchRecords();
      fetchStats();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to delete record.');
    }
  };

  const handleExportCsv = async () => {
    try {
      const exportList = await medicalRecordService.getExportData({
        search,
        department: filters.department,
        status: filters.status,
      });
      if (!exportList || exportList.length === 0) {
        toast.info('No records to export.');
        return;
      }
      const headers = [
        'ID', 'Patient ID', 'Patient Name', 'Age', 'Gender',
        'Blood Group', 'Diagnosis', 'Doctor Name', 'Department',
        'Admission Date', 'Discharge Date', 'Status', 'Recorded By', 'Notes'
      ];
      const csvRows = [
        headers.join(','),
        ...exportList.map(r => [
          r.id,
          `"${r.patientId}"`,
          `"${r.patientName.replace(/"/g, '""')}"`,
          r.age,
          r.gender,
          r.bloodGroup,
          `"${r.diagnosis.replace(/"/g, '""')}"`,
          `"${r.doctorName.replace(/"/g, '""')}"`,
          `"${r.department}"`,
          `"${new Date(r.admissionDate).toLocaleDateString()}"`,
          r.dischargeDate ? `"${new Date(r.dischargeDate).toLocaleDateString()}"` : '""',
          r.status,
          `"${r.createdBy}"`,
          `"${(r.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ];
      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Medical_Records_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Exported to CSV successfully.');
    } catch (err) {
      toast.error('Failed to export records.');
    }
  };

  const roleName = user?.role === 'SubAdministrator' ? 'Sub-Administrator' : 'Administrator';

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar pageTitle="Dashboard" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="main-content">
        {/* Welcome */}
        <div className="dashboard-welcome">
          <h2>Welcome back, {user?.fullName?.split(' ')[0]} 👋</h2>
          <p>{roleName} Dashboard — Medical Administration Portal</p>
        </div>

        {/* Stats */}
        <div className="stats-grid">
          <DashboardCard
            title="Total Records"
            value={stats?.totalRecords ?? '—'}
            icon={<FiFileText />}
            colorClass="primary"
          />
          <DashboardCard
            title="Active Patients"
            value={stats?.activePatients ?? '—'}
            icon={<FiUsers />}
            colorClass="success"
          />
          <DashboardCard
            title="Completed Cases"
            value={stats?.completedCases ?? '—'}
            icon={<FiCheckCircle />}
            colorClass="info"
          />
          <DashboardCard
            title="Departments"
            value={stats?.totalDepartments ?? '—'}
            icon={<FiGrid />}
            colorClass="warning"
          />
        </div>

        {/* Medical Records Table */}
        <div className="table-container">
          <div className="table-header">
            <div className="table-header-left">
              <h3>Medical Records</h3>
              <AccessBadge role={user?.role} />
            </div>
            <SearchBar
              search={search}
              onSearchChange={setSearch}
              filters={filters}
              onFilterChange={handleFilterChange}
            />
          </div>

          <div style={{ padding: '16px 24px 0', display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
            <button
              className="btn btn-outline"
              onClick={handleExportCsv}
              title="Download records as CSV"
              id="export-records-btn"
            >
              <FiDownload /> Export CSV
            </button>
            {isSubAdmin() && (
              <button
                className="btn btn-primary"
                onClick={() => { setEditRecord(null); setShowForm(true); }}
                id="add-record-btn"
              >
                <FiPlus /> Add Medical Record
              </button>
            )}
          </div>

          {loading ? (
            <LoadingSpinner text="Loading records..." />
          ) : (
            <DataTable
              records={records}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSort={handleSort}
              onView={setViewRecord}
              onEdit={(r) => { setEditRecord(r); setShowForm(true); }}
              onDelete={setDeleteRecord}
              page={page}
              pageSize={pageSize}
              totalCount={totalCount}
              totalPages={totalPages}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1); }}
              isSubAdmin={isSubAdmin()}
            />
          )}
        </div>
      </main>

      {/* Modals */}
      <MedicalRecordModal
        record={viewRecord}
        isOpen={!!viewRecord}
        onClose={() => setViewRecord(null)}
      />

      <MedicalRecordForm
        isOpen={showForm}
        onClose={() => { setShowForm(false); setEditRecord(null); }}
        onSubmit={editRecord ? handleUpdate : handleCreate}
        record={editRecord}
        loading={formLoading}
      />

      <ConfirmDialog
        isOpen={!!deleteRecord}
        title="Delete Medical Record"
        message={`Are you sure you want to delete the record for "${deleteRecord?.patientName}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteRecord(null)}
      />
    </div>
  );
};

export default Dashboard;
