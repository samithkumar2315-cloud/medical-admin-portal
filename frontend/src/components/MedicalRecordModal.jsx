import { FiX } from 'react-icons/fi';

const MedicalRecordModal = ({ record, isOpen, onClose }) => {
  if (!isOpen || !record) return null;

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3>Medical Record Details</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <div className="modal-body">
          <div className="record-detail-grid">
            <div className="record-detail-item">
              <span className="label">Record ID</span>
              <span className="value">#{record.id}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Patient ID</span>
              <span className="value">{record.patientId}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Patient Name</span>
              <span className="value">{record.patientName}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Age</span>
              <span className="value">{record.age} years</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Gender</span>
              <span className="value">{record.gender}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Blood Group</span>
              <span className="value">{record.bloodGroup}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Diagnosis</span>
              <span className="value">{record.diagnosis}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Doctor</span>
              <span className="value">{record.doctorName}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Department</span>
              <span className="value">{record.department}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Status</span>
              <span className="value">
                <span className={`status-badge ${record.status?.toLowerCase()}`}>
                  {record.status}
                </span>
              </span>
            </div>
            <div className="record-detail-item">
              <span className="label">Admission Date</span>
              <span className="value">{formatDate(record.admissionDate)}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Discharge Date</span>
              <span className="value">{formatDate(record.dischargeDate)}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Created By</span>
              <span className="value">{record.createdBy}</span>
            </div>
            <div className="record-detail-item">
              <span className="label">Created At</span>
              <span className="value">{formatDate(record.createdAt)}</span>
            </div>
            {record.notes && (
              <div className="record-detail-item full-width">
                <span className="label">Notes</span>
                <div className="notes-text">{record.notes}</div>
              </div>
            )}
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-secondary" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};

export default MedicalRecordModal;
