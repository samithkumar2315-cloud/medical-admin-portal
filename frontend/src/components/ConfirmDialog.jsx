import { FiAlertTriangle, FiX } from 'react-icons/fi';

const ConfirmDialog = ({ isOpen, title, message, onConfirm, onCancel, confirmText = 'Delete', confirmType = 'danger' }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="modal confirm-dialog" onClick={(e) => e.stopPropagation()}>
        <div className="modal-body">
          <div className="confirm-icon">
            <FiAlertTriangle />
          </div>
          <h3>{title || 'Are you sure?'}</h3>
          <p>{message || 'This action cannot be undone.'}</p>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onCancel}>Cancel</button>
          <button className={`btn btn-${confirmType}`} onClick={onConfirm}>
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
