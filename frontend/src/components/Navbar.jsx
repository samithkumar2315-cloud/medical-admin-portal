import { FiBell, FiMenu } from 'react-icons/fi';
import ProfileDropdown from './ProfileDropdown';

const Navbar = ({ pageTitle, onMenuToggle }) => {
  return (
    <nav className="navbar" id="main-navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onMenuToggle} id="menu-toggle-btn">
          <FiMenu />
        </button>
        <h2>{pageTitle}</h2>
      </div>
      <div className="navbar-right">
        <button className="notification-btn" id="notification-btn">
          <FiBell />
          <span className="notification-badge"></span>
        </button>
        <ProfileDropdown />
      </div>
    </nav>
  );
};

export default Navbar;
