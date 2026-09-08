import { FiEye, FiEdit2, FiTrash2, FiChevronUp, FiChevronDown } from 'react-icons/fi';
import EmptyState from './EmptyState';

const DataTable = ({
  records, sortBy, sortOrder, onSort, onView, onEdit, onDelete,
  page, pageSize, totalCount, totalPages, onPageChange, onPageSizeChange,
  isSubAdmin = false, loading = false
}) => {
  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const renderSortIcon = (column) => {
    if (sortBy !== column) return <span className="sort-icon">⇅</span>;
    return sortOrder === 'asc'
      ? <FiChevronUp className="sort-icon" size={12} />
      : <FiChevronDown className="sort-icon" size={12} />;
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      onSort(column, sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(column, 'asc');
    }
  };

  const startRecord = (page - 1) * pageSize + 1;
  const endRecord = Math.min(page * pageSize, totalCount);

  if (!loading && (!records || records.length === 0)) {
    return <EmptyState />;
  }

  return (
    <>
      <div className="table-responsive">
        <table className="data-table" id="medical-records-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Patient ID</th>
              <th
                className={sortBy === 'patientName' ? 'sorted' : ''}
                onClick={() => handleSort('patientName')}
              >
                Patient Name {renderSortIcon('patientName')}
              </th>
              <th
                className={sortBy === 'age' ? 'sorted' : ''}
                onClick={() => handleSort('age')}
              >
                Age {renderSortIcon('age')}
              </th>
              <th>Gender</th>
              <th>Blood Group</th>
              <th>Diagnosis</th>
              <th>Doctor</th>
              <th
                className={sortBy === 'department' ? 'sorted' : ''}
                onClick={() => handleSort('department')}
              >
                Department {renderSortIcon('department')}
              </th>
              <th
                className={sortBy === 'admissionDate' ? 'sorted' : ''}
                onClick={() => handleSort('admissionDate')}
              >
                Admission {renderSortIcon('admissionDate')}
              </th>
              <th
                className={sortBy === 'status' ? 'sorted' : ''}
                onClick={() => handleSort('status')}
              >
                Status {renderSortIcon('status')}
              </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr key={record.id}>
                <td>#{record.id}</td>
                <td>{record.patientId}</td>
                <td className="patient-name">{record.patientName}</td>
                <td>{record.age}</td>
                <td>{record.gender}</td>
                <td>{record.bloodGroup}</td>
                <td style={{ maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {record.diagnosis}
                </td>
                <td>{record.doctorName}</td>
                <td>{record.department}</td>
                <td>{formatDate(record.admissionDate)}</td>
                <td>
                  <span className={`status-badge ${record.status?.toLowerCase()}`}>
                    {record.status}
                  </span>
                </td>
                <td>
                  <div className="table-actions">
                    <button
                      className="action-btn view"
                      onClick={() => onView(record)}
                      title="View Details"
                    >
                      <FiEye size={13} /> View
                    </button>
                    {isSubAdmin && (
                      <>
                        <button
                          className="action-btn edit"
                          onClick={() => onEdit(record)}
                          title="Edit Record"
                        >
                          <FiEdit2 size={13} /> Edit
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => onDelete(record)}
                          title="Delete Record"
                        >
                          <FiTrash2 size={13} />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="table-pagination">
        <div className="pagination-info">
          Showing {startRecord}–{endRecord} of {totalCount} records
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <select
            className="filter-select"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            id="page-size-select"
          >
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
          </select>
          <div className="pagination-controls">
            <button
              className="pagination-btn"
              disabled={page <= 1}
              onClick={() => onPageChange(page - 1)}
            >
              ‹ Prev
            </button>
            {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i + 1;
              } else if (page <= 3) {
                pageNum = i + 1;
              } else if (page >= totalPages - 2) {
                pageNum = totalPages - 4 + i;
              } else {
                pageNum = page - 2 + i;
              }
              return (
                <button
                  key={pageNum}
                  className={`pagination-btn ${page === pageNum ? 'active' : ''}`}
                  onClick={() => onPageChange(pageNum)}
                >
                  {pageNum}
                </button>
              );
            })}
            <button
              className="pagination-btn"
              disabled={page >= totalPages}
              onClick={() => onPageChange(page + 1)}
            >
              Next ›
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DataTable;
