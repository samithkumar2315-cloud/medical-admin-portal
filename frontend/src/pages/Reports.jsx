import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/Toast';
import { medicalRecordService } from '../services/medicalRecordService';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import LoadingSpinner from '../components/LoadingSpinner';
import {
  FiBarChart2, FiDownload, FiPrinter, FiPieChart,
  FiTrendingUp, FiUsers, FiActivity, FiCheckCircle,
  FiClock, FiShield
} from 'react-icons/fi';

const Reports = () => {
  const { user } = useAuth();
  const toast = useToast();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const data = await medicalRecordService.getAnalytics();
      setAnalytics(data);
    } catch (err) {
      toast.error('Failed to load clinical analytics.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportCsv = async () => {
    try {
      setExporting(true);
      const records = await medicalRecordService.getExportData();
      if (!records || records.length === 0) {
        toast.info('No records to export.');
        return;
      }

      // Convert to CSV
      const headers = [
        'ID', 'Patient ID', 'Patient Name', 'Age', 'Gender',
        'Blood Group', 'Diagnosis', 'Doctor Name', 'Department',
        'Admission Date', 'Discharge Date', 'Status', 'Recorded By', 'Notes'
      ];

      const csvRows = [
        headers.join(','),
        ...records.map(r => [
          r.id,
          `"${r.patientId}"`,
          `"${r.patientName.replace(/"/g, '""')}"`,
          r.age,
          r.gender,
          r.bloodGroup,
          `"${r.diagnosis.replace(/"/g, '""')}"`,
          `"${r.doctorName.replace(/"/g, '""')}"`,
          `"${r.department}"`,
          `"${new Date(r.admissionDate).toLocaleDateString()}"`,
          r.dischargeDate ? `"${new Date(r.dischargeDate).toLocaleDateString()}"` : '""',
          r.status,
          `"${r.createdBy}"`,
          `"${(r.notes || '').replace(/"/g, '""')}"`
        ].join(','))
      ];

      const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.setAttribute('href', url);
      link.setAttribute('download', `Medical_Records_Export_${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('Medical records exported to CSV successfully.');
    } catch (err) {
      toast.error('Failed to export records.');
      console.error(err);
    } finally {
      setExporting(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="layout">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="main-content">
        <Navbar onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="page-content printable-area">
          <div className="page-header">
            <div>
              <div className="page-pretitle">Intelligence & Analytics</div>
              <h1 className="page-title">Clinical Reports & Statistics</h1>
              <p className="page-subtitle">
                Operational analytics, demographic breakdowns, and patient admission trends.
              </p>
            </div>
            <div className="page-actions no-print">
              <button
                className="btn-outline"
                onClick={handlePrint}
                title="Print Report"
              >
                <FiPrinter /> Print Report
              </button>
              <button
                className="btn-primary"
                onClick={handleExportCsv}
                disabled={exporting}
                title="Download CSV"
              >
                <FiDownload /> {exporting ? 'Exporting...' : 'Export Full CSV'}
              </button>
            </div>
          </div>

          {loading || !analytics ? (
            <LoadingSpinner />
          ) : (
            <div className="reports-container">
              {/* Summary KPIs */}
              <div className="reports-kpi-grid">
                <div className="kpi-card teal">
                  <div className="kpi-icon"><FiActivity /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">Total Records</span>
                    <span className="kpi-value">{analytics.totalRecords}</span>
                    <span className="kpi-sub">Across all medical disciplines</span>
                  </div>
                </div>

                <div className="kpi-card blue">
                  <div className="kpi-icon"><FiUsers /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">Unique Patients</span>
                    <span className="kpi-value">{analytics.totalPatients}</span>
                    <span className="kpi-sub">Registered clinical identities</span>
                  </div>
                </div>

                <div className="kpi-card amber">
                  <div className="kpi-icon"><FiClock /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">Active Cases</span>
                    <span className="kpi-value">{analytics.activeCases}</span>
                    <span className="kpi-sub">Currently undergoing care</span>
                  </div>
                </div>

                <div className="kpi-card green">
                  <div className="kpi-icon"><FiCheckCircle /></div>
                  <div className="kpi-info">
                    <span className="kpi-label">Completed / Discharged</span>
                    <span className="kpi-value">{analytics.completedCases + analytics.dischargedCases}</span>
                    <span className="kpi-sub">Successfully concluded treatment</span>
                  </div>
                </div>
              </div>

              {/* Charts Section */}
              <div className="reports-grid-2col">
                {/* Department Distribution */}
                <div className="report-panel">
                  <div className="report-panel-header">
                    <div className="panel-title-wrapper">
                      <FiBarChart2 className="panel-icon" />
                      <div>
                        <h3>Department Patient Load</h3>
                        <p>Distribution of admissions across hospital units</p>
                      </div>
                    </div>
                  </div>
                  <div className="report-bars-list">
                    {analytics.departmentDistribution.map((dept, idx) => (
                      <div key={dept.name} className="report-bar-item">
                        <div className="bar-label-row">
                          <span className="bar-name">{dept.name}</span>
                          <span className="bar-stat">
                            <strong>{dept.count}</strong> patients ({dept.percentage}%)
                          </span>
                        </div>
                        <div className="bar-track">
                          <div
                            className={`bar-fill dept-color-${idx % 6}`}
                            style={{ width: `${Math.max(dept.percentage, 5)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Status Breakdown & Demographics */}
                <div className="report-panel">
                  <div className="report-panel-header">
                    <div className="panel-title-wrapper">
                      <FiPieChart className="panel-icon" />
                      <div>
                        <h3>Clinical Status Ratio</h3>
                        <p>Patient recovery and progression state</p>
                      </div>
                    </div>
                  </div>
                  <div className="status-ratio-grid">
                    {analytics.statusDistribution.map(st => (
                      <div key={st.name} className={`status-stat-box ${st.name.toLowerCase()}`}>
                        <span className="status-box-name">{st.name}</span>
                        <span className="status-box-count">{st.count}</span>
                        <span className="status-box-pct">{st.percentage}% of total</span>
                      </div>
                    ))}
                  </div>

                  <div className="divider-hr" />

                  {/* Gender Split */}
                  <h4 className="sub-panel-title">Gender Demographics</h4>
                  <div className="gender-split-row">
                    {analytics.genderDistribution.map(g => (
                      <div key={g.name} className="gender-split-card">
                        <span className="gender-name">{g.name}</span>
                        <span className="gender-count">{g.count}</span>
                        <div className="gender-bar-wrapper">
                          <div
                            className={`gender-bar-fill ${g.name.toLowerCase()}`}
                            style={{ width: `${g.percentage}%` }}
                          />
                        </div>
                        <span className="gender-pct">{g.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Row: Age Demographics & Blood Group Stock */}
              <div className="reports-grid-2col">
                {/* Age Brackets */}
                <div className="report-panel">
                  <div className="report-panel-header">
                    <div className="panel-title-wrapper">
                      <FiTrendingUp className="panel-icon" />
                      <div>
                        <h3>Patient Age Distribution</h3>
                        <p>Admissions categorized by demographic brackets</p>
                      </div>
                    </div>
                  </div>
                  <div className="report-bars-list">
                    {analytics.ageGroupDistribution.map(ag => (
                      <div key={ag.name} className="report-bar-item">
                        <div className="bar-label-row">
                          <span className="bar-name">{ag.name}</span>
                          <span className="bar-stat">
                            <strong>{ag.count}</strong> ({ag.percentage}%)
                          </span>
                        </div>
                        <div className="bar-track">
                          <div
                            className="bar-fill age-bracket"
                            style={{ width: `${Math.max(ag.percentage, 4)}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Blood Group Matrix */}
                <div className="report-panel">
                  <div className="report-panel-header">
                    <div className="panel-title-wrapper">
                      <FiShield className="panel-icon" />
                      <div>
                        <h3>Blood Group Distribution</h3>
                        <p>Blood profile distribution of admitted cohort</p>
                      </div>
                    </div>
                  </div>
                  <div className="blood-matrix-grid">
                    {analytics.bloodGroupDistribution.map(bg => (
                      <div key={bg.name} className="blood-matrix-card">
                        <span className="blood-badge-lg">{bg.name}</span>
                        <span className="blood-count">{bg.count} Patients</span>
                        <span className="blood-pct">{bg.percentage}%</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Reports;
