import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  FiUsers, FiUserPlus, FiShield, FiMail,
  FiPhone, FiCalendar, FiX, FiCheckCircle
} from 'react-icons/fi';

const StaffManagement = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // New staff form state
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    fullName: '',
    email: '',
    phone: '',
    role: 'SubAdministrator',
  });
  const [formError, setFormError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await userService.getAllUsers();
      setUsers(data || []);
    } catch (err) {
      toast.error('Failed to load system staff accounts.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCreateStaff = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.username.trim() || !formData.password || !formData.fullName.trim()) {
      setFormError('Username, password, and full name are required.');
      return;
    }

    if (formData.password.length < 6) {
      setFormError('Password must be at least 6 characters.');
      return;
    }

    try {
      setSubmitting(true);
      await userService.createStaffUser(formData);
      toast.success(`Staff account created for ${formData.fullName}.`);
      setShowModal(false);
      setFormData({
        username: '',
        password: '',
        fullName: '',
        email: '',
        phone: '',
        role: 'SubAdministrator',
      });
      fetchUsers();
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to create staff account.';
      setFormError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="page-content">
          <div className="page-header">
            <div>
              <div className="page-pretitle">System Administration</div>
              <h1 className="page-title">Staff & Access Control</h1>
              <p className="page-subtitle">
                Manage registered administrative personnel and portal operational credentials.
              </p>
            </div>
            <div className="page-actions">
              <button
                className="btn-primary"
                onClick={() => setShowModal(true)}
              >
                <FiUserPlus /> Add Staff Member
              </button>
            </div>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : users.length === 0 ? (
            <EmptyState title="No staff accounts found" message="Add administrative accounts to get started." />
          ) : (
            <div className="data-table-container">
              <div className="table-responsive">
                <table className="data-table" id="staff-table">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role & Permissions</th>
                      <th>Email</th>
                      <th>Phone</th>
                      <th>Provisioned Date</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-cell">
                            <div className="user-avatar-sm">
                              {u.fullName.charAt(0)}
                            </div>
                            <div>
                              <div className="user-name-strong">{u.fullName}</div>
                              <span className="user-login-tag">@{u.username}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`role-badge ${u.role.toLowerCase()}`}>
                            <FiShield size={12} /> {u.role === 'Administrator' ? 'Administrator (Read-Only)' : 'Sub-Administrator (Full CRUD)'}
                          </span>
                        </td>
                        <td>
                          <span className="contact-cell">
                            <FiMail size={13} /> {u.email || '—'}
                          </span>
                        </td>
                        <td>
                          <span className="contact-cell">
                            <FiPhone size={13} /> {u.phone || '—'}
                          </span>
                        </td>
                        <td>
                          <span className="contact-cell">
                            <FiCalendar size={13} /> {new Date(u.createdAt).toLocaleDateString()}
                          </span>
                        </td>
                        <td>
                          <span className="status-pill active">
                            <FiCheckCircle size={12} /> Active
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Add Staff Modal */}
          {showModal && (
            <div className="modal-backdrop" onClick={() => setShowModal(false)}>
              <div className="modal-content form-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div className="modal-header-info">
                    <div className="modal-icon-badge">
                      <FiUserPlus />
                    </div>
                    <div>
                      <h2>Provision Staff Account</h2>
                      <p>Create new portal login credentials</p>
                    </div>
                  </div>
                  <button className="modal-close-btn" onClick={() => setShowModal(false)}>
                    <FiX />
                  </button>
                </div>

                <form onSubmit={handleCreateStaff} className="staff-form">
                  {formError && (
                    <div className="login-error" style={{ marginBottom: 16 }}>
                      {formError}
                    </div>
                  )}

                  <div className="form-grid">
                    <div className="form-group">
                      <label htmlFor="staff-fullname">Full Name *</label>
                      <input
                        id="staff-fullname"
                        name="fullName"
                        type="text"
                        className="form-control"
                        placeholder="e.g. Dr. Sarah Connor"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="staff-username">Username *</label>
                      <input
                        id="staff-username"
                        name="username"
                        type="text"
                        className="form-control"
                        placeholder="e.g. sconnor"
                        value={formData.username}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="staff-password">Initial Password *</label>
                      <input
                        id="staff-password"
                        name="password"
                        type="password"
                        className="form-control"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="staff-role">Assigned Role *</label>
                      <select
                        id="staff-role"
                        name="role"
                        className="form-control"
                        value={formData.role}
                        onChange={handleInputChange}
                      >
                        <option value="SubAdministrator">Sub-Administrator (Full CRUD on Records)</option>
                        <option value="Administrator">Administrator (Read-Only Records & Analytics)</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label htmlFor="staff-email">Official Email</label>
                      <input
                        id="staff-email"
                        name="email"
                        type="email"
                        className="form-control"
                        placeholder="e.g. sarah@medportal.com"
                        value={formData.email}
                        onChange={handleInputChange}
                      />
                    </div>

                    <div className="form-group">
                      <label htmlFor="staff-phone">Phone Number</label>
                      <input
                        id="staff-phone"
                        name="phone"
                        type="text"
                        className="form-control"
                        placeholder="e.g. +1-555-0300"
                        value={formData.phone}
                        onChange={handleInputChange}
                      />
                    </div>
                  </div>

                  <div className="modal-actions" style={{ marginTop: 24 }}>
                    <button
                      type="button"
                      className="btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn-primary"
                      disabled={submitting}
                    >
                      {submitting ? 'Creating Account...' : 'Provision Account'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default StaffManagement;
