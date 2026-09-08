import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { medicalRecordService } from '../services/medicalRecordService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import EmptyState from '../components/EmptyState';
import {
  FiUsers, FiSearch, FiClock, FiCalendar,
  FiActivity, FiX, FiPrinter, FiChevronRight,
  FiChevronLeft, FiFileText
} from 'react-icons/fi';

const Patients = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pageSize] = useState(8);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // Patient detail modal
  const [selectedPatientId, setSelectedPatientId] = useState(null);
  const [patientHistory, setPatientHistory] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);

  const fetchPatients = useCallback(async () => {
    try {
      setLoading(true);
      const data = await medicalRecordService.getPatients({
        search,
        page,
        pageSize,
      });
      setPatients(data.items || []);
      setTotalCount(data.totalCount || 0);
      setTotalPages(data.totalPages || 0);
    } catch (err) {
      toast.error('Failed to load patient records.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [search, page, pageSize]);

  useEffect(() => {
    fetchPatients();
  }, [fetchPatients]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const openPatientHistory = async (patientId) => {
    setSelectedPatientId(patientId);
    setHistoryLoading(true);
    try {
      const data = await medicalRecordService.getPatientHistory(patientId);
      setPatientHistory(data);
    } catch (err) {
      toast.error('Failed to load patient history.');
      console.error(err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const closePatientHistory = () => {
    setSelectedPatientId(null);
    setPatientHistory(null);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="page-content">
          <div className="page-header">
            <div>
              <div className="page-pretitle">Clinical Registry</div>
              <h1 className="page-title">Patients Directory</h1>
              <p className="page-subtitle">
                Centralized patient history, medical admissions, and diagnoses records.
              </p>
            </div>
            <div className="page-actions">
              <span className="badge-count">
                <FiUsers /> {totalCount} Registered Patients
              </span>
            </div>
          </div>

          {/* Search bar */}
          <div className="patients-toolbar">
            <div className="patient-search-wrapper">
              <FiSearch className="search-icon" />
              <input
                type="text"
                placeholder="Search patient name, ID (e.g. P001), diagnosis, or doctor..."
                value={search}
                onChange={handleSearchChange}
                className="patient-search-input"
              />
              {search && (
                <button
                  className="clear-search-btn"
                  onClick={() => setSearch('')}
                  title="Clear search"
                >
                  <FiX />
                </button>
              )}
            </div>
          </div>

          {/* Patient Cards Grid */}
          {loading ? (
            <LoadingSpinner />
          ) : patients.length === 0 ? (
            <EmptyState
              title="No patients found"
              message={search ? 'Try adjusting your search criteria.' : 'No patient records available.'}
            />
          ) : (
            <>
              <div className="patients-grid">
                {patients.map((p) => (
                  <div
                    key={p.patientId}
                    className="patient-card"
                    onClick={() => openPatientHistory(p.patientId)}
                  >
                    <div className="patient-card-header">
                      <div className="patient-avatar">
                        {p.patientName.charAt(0)}
                      </div>
                      <div className="patient-card-title">
                        <h3>{p.patientName}</h3>
                        <span className="patient-id-tag">{p.patientId}</span>
                      </div>
                      <span className={`status-pill ${p.latestStatus.toLowerCase()}`}>
                        {p.latestStatus}
                      </span>
                    </div>

                    <div className="patient-vitals-row">
                      <span className="vital-badge blood-group">{p.bloodGroup}</span>
                      <span className="vital-badge age-badge">{p.age} yrs</span>
                      <span className="vital-badge gender-badge">{p.gender}</span>
                      <span className="vital-badge visits-badge">
                        <FiClock size={12} /> {p.recordCount} {p.recordCount === 1 ? 'Record' : 'Records'}
                      </span>
                    </div>

                    <div className="patient-card-body">
                      <div className="patient-info-line">
                        <span className="label">Latest Diagnosis:</span>
                        <span className="value diagnosis-highlight">{p.latestDiagnosis}</span>
                      </div>
                      <div className="patient-info-line">
                        <span className="label">Department:</span>
                        <span className="value">{p.department}</span>
                      </div>
                      <div className="patient-info-line">
                        <span className="label">Doctor:</span>
                        <span className="value">{p.latestDoctor}</span>
                      </div>
                      <div className="patient-info-line">
                        <span className="label">Admission:</span>
                        <span className="value">
                          {new Date(p.latestAdmissionDate).toLocaleDateString()}
                        </span>
                      </div>
                    </div>

                    <div className="patient-card-footer">
                      <span>View Medical History</span>
                      <FiChevronRight />
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="pagination">
                  <span className="pagination-info">
                    Showing {(page - 1) * pageSize + 1} to {Math.min(page * pageSize, totalCount)} of {totalCount} patients
                  </span>
                  <div className="pagination-buttons">
                    <button
                      className="pagination-btn"
                      disabled={page <= 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                    >
                      <FiChevronLeft /> Prev
                    </button>
                    <span className="page-indicator">Page {page} of {totalPages}</span>
                    <button
                      className="pagination-btn"
                      disabled={page >= totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    >
                      Next <FiChevronRight />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* Patient Medical History Modal */}
          {selectedPatientId && (
            <div className="modal-backdrop" onClick={closePatientHistory}>
              <div
                className="modal-content patient-history-modal printable-area"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="modal-header">
                  <div className="modal-header-info">
                    <div className="modal-icon-badge">
                      <FiActivity />
                    </div>
                    <div>
                      <h2>Comprehensive Patient History</h2>
                      <p>Clinical records and admission trajectory</p>
                    </div>
                  </div>
                  <div className="modal-header-actions no-print">
                    <button className="btn-outline-sm" onClick={handlePrint} title="Print Medical Sheet">
                      <FiPrinter /> Print Sheet
                    </button>
                    <button className="modal-close-btn" onClick={closePatientHistory}>
                      <FiX />
                    </button>
                  </div>
                </div>

                {historyLoading || !patientHistory ? (
                  <div style={{ padding: '40px 0' }}>
                    <LoadingSpinner />
                  </div>
                ) : (
                  <div className="patient-history-body">
                    {/* Patient Summary Header Card */}
                    <div className="patient-summary-banner">
                      <div className="summary-col">
                        <span className="summary-label">Patient Name</span>
                        <h3 className="summary-value">{patientHistory.summary.patientName}</h3>
                        <span className="patient-id-tag">{patientHistory.summary.patientId}</span>
                      </div>
                      <div className="summary-col">
                        <span className="summary-label">Demographics</span>
                        <div className="summary-badges">
                          <span className="vital-badge age-badge">{patientHistory.summary.age} Years</span>
                          <span className="vital-badge gender-badge">{patientHistory.summary.gender}</span>
                          <span className="vital-badge blood-group">{patientHistory.summary.bloodGroup}</span>
                        </div>
                      </div>
                      <div className="summary-col">
                        <span className="summary-label">Primary Diagnosis</span>
                        <span className="summary-highlight">{patientHistory.summary.latestDiagnosis}</span>
                      </div>
                      <div className="summary-col">
                        <span className="summary-label">Total Admissions</span>
                        <span className="summary-count">{patientHistory.records.length} Recorded Visits</span>
                      </div>
                    </div>

                    {/* Timeline of Records */}
                    <div className="timeline-section">
                      <h4 className="timeline-heading">
                        <FiCalendar /> Medical History Timeline
                      </h4>
                      <div className="clinical-timeline">
                        {patientHistory.records.map((rec, index) => (
                          <div key={rec.id} className="timeline-item">
                            <div className="timeline-marker">
                              <span className="marker-dot"></span>
                              {index !== patientHistory.records.length - 1 && <span className="marker-line"></span>}
                            </div>
                            <div className="timeline-content-card">
                              <div className="timeline-card-header">
                                <div>
                                  <span className="timeline-date">
                                    {new Date(rec.admissionDate).toLocaleDateString(undefined, {
                                      weekday: 'short',
                                      year: 'numeric',
                                      month: 'short',
                                      day: 'numeric'
                                    })}
                                  </span>
                                  {rec.dischargeDate && (
                                    <span className="timeline-discharge">
                                      &nbsp;→ Discharged: {new Date(rec.dischargeDate).toLocaleDateString()}
                                    </span>
                                  )}
                                </div>
                                <span className={`status-pill ${rec.status.toLowerCase()}`}>
                                  {rec.status}
                                </span>
                              </div>

                              <div className="timeline-card-details">
                                <div className="timeline-detail-item">
                                  <strong>Diagnosis:</strong> {rec.diagnosis}
                                </div>
                                <div className="timeline-detail-item">
                                  <strong>Department:</strong> {rec.department}
                                </div>
                                <div className="timeline-detail-item">
                                  <strong>Physician:</strong> {rec.doctorName}
                                </div>
                                <div className="timeline-detail-item">
                                  <strong>Recorded By:</strong> {rec.createdBy || 'Staff'}
                                </div>
                              </div>

                              {rec.notes && (
                                <div className="timeline-card-notes">
                                  <FiFileText size={14} />
                                  <p>{rec.notes}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Patients;
