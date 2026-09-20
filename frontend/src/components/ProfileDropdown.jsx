import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiUser, FiEdit, FiArrowLeft, FiLogOut } from 'react-icons/fi';

const ProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const { user, logout, getBasePath } = useAuth();
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleNavigate = (path) => {
    setOpen(false);
    navigate(path);
  };

  const handleLogout = () => {
    setOpen(false);
    logout();
    navigate('/login', { replace: true });
  };

  const basePath = getBasePath();
  const initials = user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  return (
    <div className="profile-dropdown-wrapper" ref={ref}>
      <button
        className={`profile-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen(!open)}
        id="profile-dropdown-trigger"
      >
        <div className="profile-avatar">{initials}</div>
        <div className="profile-trigger-info">
          <div className="name">{user?.fullName}</div>
          <div className="role">{user?.role === 'SubAdministrator' ? 'Sup Administrator' : user?.role}</div>
        </div>
        <span className="chevron">▾</span>
      </button>

      {open && (
        <div className="profile-dropdown" id="profile-dropdown-menu">
          <div className="profile-dropdown-header">
            <div className="name">{user?.fullName}</div>
            <div className="email">{user?.email || user?.username}</div>
          </div>
          <div className="profile-dropdown-menu">
            <button
              className="profile-dropdown-item"
              onClick={() => handleNavigate(`${basePath}/profile`)}
            >
              <FiUser /> My Profile
            </button>
            <button
              className="profile-dropdown-item"
              onClick={() => handleNavigate(`${basePath}/profile?edit=true`)}
            >
              <FiEdit /> Update Profile
            </button>
            <button
              className="profile-dropdown-item"
              onClick={() => handleNavigate(`${basePath}/dashboard`)}
            >
              <FiArrowLeft /> Back to Dashboard
            </button>
            <div className="profile-dropdown-divider" />
            <button
              className="profile-dropdown-item danger"
              onClick={handleLogout}
            >
              <FiLogOut /> Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileDropdown;
