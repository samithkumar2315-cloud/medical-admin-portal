import { FiInbox } from 'react-icons/fi';

const EmptyState = ({ title = 'No records found', message = 'Try adjusting your search or filters.', icon }) => {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">
        {icon || <FiInbox />}
      </div>
      <h3>{title}</h3>
      <p>{message}</p>
    </div>
  );
};

export default EmptyState;
