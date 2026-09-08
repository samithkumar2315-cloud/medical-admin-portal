import { FiEye, FiLock } from 'react-icons/fi';

const AccessBadge = ({ role }) => {
  if (role === 'Administrator') {
    return (
      <span className="access-badge view-only" title="View Only Access">
        <FiEye size={11} /> View Only
      </span>
    );
  }

  return (
    <span className="access-badge full-access" title="Full Access">
      <FiLock size={11} /> Full Access
    </span>
  );
};

export default AccessBadge;
