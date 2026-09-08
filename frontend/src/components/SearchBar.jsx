import { FiSearch } from 'react-icons/fi';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_OPTIONS = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
const DEPARTMENT_OPTIONS = [
  'General Medicine', 'Cardiology', 'Neurology', 'Orthopedics',
  'Pediatrics', 'Dermatology', 'Ophthalmology', 'ENT',
  'Gynecology', 'Urology', 'Oncology', 'Psychiatry',
  'Radiology', 'Pathology', 'Emergency Medicine'
];
const STATUS_OPTIONS = ['Active', 'Completed', 'Discharged', 'Pending', 'Cancelled'];

const departmentToEnum = (display) => {
  const map = {
    'General Medicine': 'GeneralMedicine',
    'Emergency Medicine': 'EmergencyMedicine',
  };
  return map[display] || display;
};

const bloodGroupToEnum = (display) => {
  const map = {
    'A+': 'APositive', 'A-': 'ANegative',
    'B+': 'BPositive', 'B-': 'BNegative',
    'AB+': 'ABPositive', 'AB-': 'ABNegative',
    'O+': 'OPositive', 'O-': 'ONegative',
  };
  return map[display] || display;
};

const SearchBar = ({ search, onSearchChange, filters, onFilterChange }) => {
  return (
    <div className="table-header-right">
      <div className="search-input-wrapper">
        <FiSearch className="search-icon" />
        <input
          type="text"
          placeholder="Search patient, diagnosis, doctor..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          id="search-input"
        />
      </div>
      <select
        className="filter-select"
        value={filters.gender || ''}
        onChange={(e) => onFilterChange('gender', e.target.value)}
        id="filter-gender"
      >
        <option value="">All Genders</option>
        {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
      </select>
      <select
        className="filter-select"
        value={filters.bloodGroup || ''}
        onChange={(e) => onFilterChange('bloodGroup', bloodGroupToEnum(e.target.value))}
        id="filter-blood-group"
      >
        <option value="">All Blood Groups</option>
        {BLOOD_GROUP_OPTIONS.map((bg) => <option key={bg} value={bg}>{bg}</option>)}
      </select>
      <select
        className="filter-select"
        value={filters.department || ''}
        onChange={(e) => onFilterChange('department', departmentToEnum(e.target.value))}
        id="filter-department"
      >
        <option value="">All Departments</option>
        {DEPARTMENT_OPTIONS.map((d) => <option key={d} value={d}>{d}</option>)}
      </select>
      <select
        className="filter-select"
        value={filters.status || ''}
        onChange={(e) => onFilterChange('status', e.target.value)}
        id="filter-status"
      >
        <option value="">All Statuses</option>
        {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
    </div>
  );
};

export default SearchBar;
