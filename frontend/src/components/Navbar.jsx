import { FiMenu } from 'react-icons/fi';
import ProfileDropdown from './ProfileDropdown';
import NotificationDropdown from './NotificationDropdown';

const Navbar = ({ pageTitle, onMenuToggle, onToggleSidebar }) => {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle || onToggleSidebar} id="menu-toggle-btn">
          <FiMenu />
        </button>
        <h2>{pageTitle || 'Medical Portal'}</h2>
      </div>
      <div className="navbar-right">
        <NotificationDropdown />
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
