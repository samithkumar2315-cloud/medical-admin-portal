import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FiGrid, FiFileText, FiUsers, FiBarChart2,
  FiUser, FiLogOut, FiActivity
} from 'react-icons/fi';

const Sidebar = ({ isOpen, onClose }) => {
  const { user, logout, getBasePath, isSubAdmin } = useAuth();
  const navigate = useNavigate();
  const basePath = getBasePath();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const handleLinkClick = () => {
    if (window.innerWidth <= 1024) {
      onClose();
    }
  };

  return (
    <>
      <div className={`sidebar-overlay ${isOpen ? 'open' : ''}`} onClick={onClose} />
      <aside className={`sidebar ${isOpen ? 'open' : ''}`} id="main-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <FiActivity />
          </div>
          <h1>
            Medical Admin
            <span>Portal</span>
          </h1>
        </div>

        <nav className="sidebar-nav">
          <div className="sidebar-section">
            <div className="sidebar-section-title">Main</div>
            <NavLink
              to={`${basePath}/dashboard`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="icon"><FiGrid /></span>
              Dashboard
            </NavLink>
            <NavLink
              to={`${basePath}/medical-records`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="icon"><FiFileText /></span>
              Medical Records
            </NavLink>
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Overview</div>
            <NavLink
              to={`${basePath}/patients`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="icon"><FiUsers /></span>
              Patients
            </NavLink>
            <NavLink
              to={`${basePath}/reports`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="icon"><FiBarChart2 /></span>
              Reports & Stats
            </NavLink>
            {!isSubAdmin && (
              <NavLink
                to="/admin/staff"
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                onClick={handleLinkClick}
              >
                <span className="icon"><FiUsers /></span>
                Staff Accounts
              </NavLink>
            )}
          </div>

          <div className="sidebar-section">
            <div className="sidebar-section-title">Account</div>
            <NavLink
              to={`${basePath}/profile`}
              className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              onClick={handleLinkClick}
            >
              <span className="icon"><FiUser /></span>
              My Profile
            </NavLink>
          </div>
        </nav>

        <div className="sidebar-footer">
          <button className="sidebar-link" onClick={handleLogout} id="sidebar-logout-btn">
            <span className="icon"><FiLogOut /></span>
            Logout
          </button>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
