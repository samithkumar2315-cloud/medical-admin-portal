import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { userService } from '../services/userService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import { FiUser, FiMail, FiPhone, FiCalendar, FiShield, FiEdit2, FiLock } from 'react-icons/fi';

const Profile = () => {
  const { user } = useAuth();
  const toast = useToast();
  const [searchParams] = useSearchParams();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(searchParams.get('edit') === 'true');
  const [changingPassword, setChangingPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  // Edit form
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', profileImageUrl: '' });

  // Password form
  const [pwForm, setPwForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [pwErrors, setPwErrors] = useState({});

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      const data = await userService.getProfile();
      setProfile(data);
      setForm({
        fullName: data.fullName || '',
        email: data.email || '',
        phone: data.phone || '',
        profileImageUrl: data.profileImageUrl || '',
      });
    } catch (err) {
      toast.error('Failed to load profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    if (!form.fullName.trim()) {
      toast.error('Full name is required.');
      return;
    }
    try {
      setSaving(true);
      const updated = await userService.updateProfile(form);
      setProfile(updated);
      setEditing(false);
      toast.success('Profile updated successfully.');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile.');
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    const errors = {};
    if (!pwForm.currentPassword) errors.currentPassword = 'Required';
    if (!pwForm.newPassword || pwForm.newPassword.length < 6) errors.newPassword = 'Min 6 characters';
    if (pwForm.newPassword !== pwForm.confirmPassword) errors.confirmPassword = 'Passwords do not match';
    setPwErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setSaving(true);
      await userService.changePassword(pwForm);
      toast.success('Password changed successfully.');
      setChangingPassword(false);
      setPwForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Current password is incorrect.');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  const initials = profile?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <Navbar pageTitle="My Profile" onMenuToggle={() => setSidebarOpen(!sidebarOpen)} />

      <main className="main-content">
        {loading ? (
          <LoadingSpinner text="Loading profile..." />
        ) : (
          <div className="profile-page">
            <div className="profile-card">
              <div className="profile-header">
                <div className="profile-avatar-large">{initials}</div>
                <div className="profile-header-info">
                  <h2>{profile?.fullName}</h2>
                  <span className="role-badge">
                    <FiShield size={12} />
                    {profile?.role === 'SubAdministrator' ? 'Sub-Administrator' : profile?.role}
                  </span>
                </div>
              </div>

              <div className="profile-body">
                {!editing ? (
                  <>
                    <div className="profile-info-grid">
                      <div className="profile-info-item">
                        <span className="label"><FiUser size={12} /> Username</span>
                        <span className="value">{profile?.username}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="label"><FiMail size={12} /> Email</span>
                        <span className="value">{profile?.email || '—'}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="label"><FiPhone size={12} /> Phone</span>
                        <span className="value">{profile?.phone || '—'}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="label"><FiShield size={12} /> Role</span>
                        <span className="value">
                          {profile?.role === 'SubAdministrator' ? 'Sub-Administrator' : profile?.role}
                        </span>
                      </div>
                      <div className="profile-info-item">
                        <span className="label"><FiCalendar size={12} /> Account Created</span>
                        <span className="value">{formatDate(profile?.createdAt)}</span>
                      </div>
                      <div className="profile-info-item">
                        <span className="label"><FiCalendar size={12} /> Last Updated</span>
                        <span className="value">{formatDate(profile?.updatedAt)}</span>
                      </div>
                    </div>

                    <div className="profile-actions">
                      <button className="btn btn-primary" onClick={() => setEditing(true)}>
                        <FiEdit2 /> Update Profile
                      </button>
                      <button className="btn btn-outline" onClick={() => setChangingPassword(true)}>
                        <FiLock /> Change Password
                      </button>
                    </div>
                  </>
                ) : (
                  <form onSubmit={handleSaveProfile}>
                    <div className="form-grid">
                      <div className="form-group">
                        <label>Username</label>
                        <input type="text" value={profile?.username} disabled style={{ opacity: 0.6 }} />
                      </div>
                      <div className="form-group">
                        <label>Role</label>
                        <input type="text" value={profile?.role === 'SubAdministrator' ? 'Sub-Administrator' : profile?.role} disabled style={{ opacity: 0.6 }} />
                      </div>
                      <div className="form-group">
                        <label>Full Name *</label>
                        <input
                          type="text" value={form.fullName}
                          onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Email</label>
                        <input
                          type="email" value={form.email}
                          onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Phone</label>
                        <input
                          type="text" value={form.phone}
                          onChange={(e) => setForm({ ...form, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-group">
                        <label>Profile Image URL</label>
                        <input
                          type="text" value={form.profileImageUrl}
                          onChange={(e) => setForm({ ...form, profileImageUrl: e.target.value })}
                          placeholder="https://..."
                        />
                      </div>
                    </div>
                    <div className="profile-actions">
                      <button type="submit" className="btn btn-primary" disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button type="button" className="btn btn-secondary" onClick={() => setEditing(false)}>
                        Cancel
                      </button>
                    </div>
                  </form>
                )}

                {/* Change Password */}
                {changingPassword && (
                  <div className="password-section">
                    <h3><FiLock /> Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                      <div className="form-grid">
                        <div className="form-group full-width">
                          <label>Current Password *</label>
                          <input
                            type="password"
                            value={pwForm.currentPassword}
                            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                          />
                          {pwErrors.currentPassword && <span className="form-error">{pwErrors.currentPassword}</span>}
                        </div>
                        <div className="form-group">
                          <label>New Password *</label>
                          <input
                            type="password"
                            value={pwForm.newPassword}
                            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                          />
                          {pwErrors.newPassword && <span className="form-error">{pwErrors.newPassword}</span>}
                        </div>
                        <div className="form-group">
                          <label>Confirm New Password *</label>
                          <input
                            type="password"
                            value={pwForm.confirmPassword}
                            onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                          />
                          {pwErrors.confirmPassword && <span className="form-error">{pwErrors.confirmPassword}</span>}
                        </div>
                      </div>
                      <div className="profile-actions">
                        <button type="submit" className="btn btn-primary" disabled={saving}>
                          {saving ? 'Changing...' : 'Change Password'}
                        </button>
                        <button type="button" className="btn btn-secondary" onClick={() => setChangingPassword(false)}>
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
