import { useState, useRef, useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import {
  FiBell, FiUserPlus, FiUserMinus, FiEdit3,
  FiActivity, FiCheck, FiTrash2, FiX, FiClock,
  FiInbox
} from 'react-icons/fi';

const formatTimeAgo = (isoString) => {
  if (!isoString) return 'Just now';
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};

const NotificationDropdown = () => {
  const [open, setOpen] = useState(false);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearAll,
    removeNotification
  } = useNotifications();
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

  const getIcon = (type) => {
    switch (type) {
      case 'patient_added':
        return <FiUserPlus className="notif-icon-svg added" />;
      case 'patient_removed':
        return <FiUserMinus className="notif-icon-svg removed" />;
      case 'patient_updated':
        return <FiEdit3 className="notif-icon-svg updated" />;
      default:
        return <FiActivity className="notif-icon-svg system" />;
    }
  };

  return (
    <div className="notification-dropdown-wrapper" ref={ref}>
      <button
        className={`notification-btn ${open ? 'active' : ''}`}
        onClick={() => setOpen(!open)}
        id="notification-btn"
        aria-label="View notifications"
        title="View Notifications"
      >
        <FiBell />
        {unreadCount > 0 && (
          <span className="notification-badge-count" id="notification-badge-count">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="notification-dropdown" id="notification-dropdown-menu">
          <div className="notification-header">
            <div className="notification-header-title">
              <span className="title-text">Notifications</span>
              {unreadCount > 0 && (
                <span className="unread-pill">{unreadCount} New</span>
              )}
            </div>
            <div className="notification-header-actions">
              {unreadCount > 0 && (
                <button
                  className="notif-action-btn"
                  onClick={markAllAsRead}
                  title="Mark all as read"
                >
                  <FiCheck size={13} /> Mark read
                </button>
              )}
              {notifications.length > 0 && (
                <button
                  className="notif-action-btn danger"
                  onClick={clearAll}
                  title="Clear all notifications"
                >
                  <FiTrash2 size={13} /> Clear
                </button>
              )}
            </div>
          </div>

          <div className="notification-body">
            {notifications.length === 0 ? (
              <div className="notification-empty">
                <FiInbox className="empty-icon" />
                <p className="empty-title">No notifications</p>
                <p className="empty-sub">You are all caught up with clinical events.</p>
              </div>
            ) : (
              <div className="notification-list">
                {notifications.map((notif) => (
                  <div
                    key={notif.id}
                    className={`notification-item ${!notif.read ? 'unread' : ''} ${notif.type}`}
                    onClick={() => markAsRead(notif.id)}
                  >
                    <div className={`notif-icon-container ${notif.type}`}>
                      {getIcon(notif.type)}
                    </div>
                    <div className="notif-content">
                      <div className="notif-title-row">
                        <span className="notif-title">{notif.title}</span>
                        <span className="notif-time">
                          <FiClock size={10} /> {formatTimeAgo(notif.timestamp)}
                        </span>
                      </div>
                      <div className="notif-message">{notif.message}</div>
                      {notif.patientId && (
                        <span className="notif-patient-tag">
                          ID: {notif.patientId}
                        </span>
                      )}
                    </div>
                    <button
                      className="notif-dismiss-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeNotification(notif.id);
                      }}
                      title="Dismiss"
                    >
                      <FiX size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationDropdown;
