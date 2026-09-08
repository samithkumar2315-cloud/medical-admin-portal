import { useState, useEffect } from 'react';
import { FiX } from 'react-icons/fi';

const GENDER_OPTIONS = ['Male', 'Female', 'Other'];
const BLOOD_GROUP_OPTIONS = [
  { value: 'OPositive', label: 'O+' },
  { value: 'ONegative', label: 'O-' },
  { value: 'APositive', label: 'A+' },
  { value: 'ANegative', label: 'A-' },
  { value: 'BPositive', label: 'B+' },
  { value: 'BNegative', label: 'B-' },
  { value: 'ABPositive', label: 'AB+' },
  { value: 'ABNegative', label: 'AB-' },
];
const STATUS_OPTIONS = ['Active', 'Completed', 'Discharged', 'Pending', 'Cancelled'];
const DEPARTMENT_OPTIONS = [
  { value: 'GeneralMedicine', label: 'General Medicine' },
  { value: 'Cardiology', label: 'Cardiology' },
  { value: 'Neurology', label: 'Neurology' },
  { value: 'Orthopedics', label: 'Orthopedics' },
  { value: 'Pediatrics', label: 'Pediatrics' },
  { value: 'Dermatology', label: 'Dermatology' },
  { value: 'Ophthalmology', label: 'Ophthalmology' },
  { value: 'ENT', label: 'ENT' },
  { value: 'Gynecology', label: 'Gynecology' },
  { value: 'Urology', label: 'Urology' },
  { value: 'Oncology', label: 'Oncology' },
  { value: 'Psychiatry', label: 'Psychiatry' },
  { value: 'Radiology', label: 'Radiology' },
  { value: 'Pathology', label: 'Pathology' },
  { value: 'EmergencyMedicine', label: 'Emergency Medicine' },
];

const initialFormState = {
  patientId: '',
  patientName: '',
  age: '',
  gender: '',
  bloodGroup: '',
  diagnosis: '',
  doctorName: '',
  department: '',
  admissionDate: '',
  dischargeDate: '',
  status: '',
  notes: '',
};

const bloodGroupToEnum = (displayValue) => {
  const map = {
    'A+': 'APositive', 'A-': 'ANegative',
    'B+': 'BPositive', 'B-': 'BNegative',
    'AB+': 'ABPositive', 'AB-': 'ABNegative',
    'O+': 'OPositive', 'O-': 'ONegative',
  };
  return map[displayValue] || displayValue;
};

const departmentToEnum = (displayValue) => {
  const map = {
    'General Medicine': 'GeneralMedicine',
    'Emergency Medicine': 'EmergencyMedicine',
  };
  return map[displayValue] || displayValue;
};

const MedicalRecordForm = ({ isOpen, onClose, onSubmit, record = null, loading = false }) => {
  const [form, setForm] = useState(initialFormState);
  const [errors, setErrors] = useState({});
  const isEdit = !!record;

  useEffect(() => {
    if (record) {
      setForm({
        patientId: record.patientId || '',
        patientName: record.patientName || '',
        age: record.age?.toString() || '',
        gender: record.gender || '',
        bloodGroup: bloodGroupToEnum(record.bloodGroup) || '',
        diagnosis: record.diagnosis || '',
        doctorName: record.doctorName || '',
        department: departmentToEnum(record.department) || '',
        admissionDate: record.admissionDate ? record.admissionDate.split('T')[0] : '',
        dischargeDate: record.dischargeDate ? record.dischargeDate.split('T')[0] : '',
        status: record.status || '',
        notes: record.notes || '',
      });
    } else {
      setForm(initialFormState);
    }
    setErrors({});
  }, [record, isOpen]);

  if (!isOpen) return null;

  const validate = () => {
    const newErrors = {};
    if (!form.patientId.trim()) newErrors.patientId = 'Patient ID is required';
    if (!form.patientName.trim()) newErrors.patientName = 'Patient name is required';
    if (!form.age || isNaN(form.age) || +form.age < 0 || +form.age > 150) newErrors.age = 'Valid age required (0-150)';
    if (!form.gender) newErrors.gender = 'Gender is required';
    if (!form.bloodGroup) newErrors.bloodGroup = 'Blood group is required';
    if (!form.diagnosis.trim()) newErrors.diagnosis = 'Diagnosis is required';
    if (!form.doctorName.trim()) newErrors.doctorName = 'Doctor name is required';
    if (!form.department) newErrors.department = 'Department is required';
    if (!form.admissionDate) newErrors.admissionDate = 'Admission date is required';
    if (!form.status) newErrors.status = 'Status is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    const data = {
      ...form,
      age: parseInt(form.age),
      admissionDate: new Date(form.admissionDate).toISOString(),
      dischargeDate: form.dischargeDate ? new Date(form.dischargeDate).toISOString() : null,
    };
    onSubmit(data);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '720px' }}>
        <div className="modal-header">
          <h3>{isEdit ? 'Edit Medical Record' : 'Add Medical Record'}</h3>
          <button className="modal-close" onClick={onClose}><FiX /></button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-grid">
              <div className="form-group">
                <label>Patient ID *</label>
                <input
                  type="text" name="patientId" value={form.patientId}
                  onChange={handleChange} placeholder="e.g., P016"
                />
                {errors.patientId && <span className="form-error">{errors.patientId}</span>}
              </div>
              <div className="form-group">
                <label>Patient Name *</label>
                <input
                  type="text" name="patientName" value={form.patientName}
                  onChange={handleChange} placeholder="Full name"
                />
                {errors.patientName && <span className="form-error">{errors.patientName}</span>}
              </div>
              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number" name="age" value={form.age}
                  onChange={handleChange} placeholder="Age" min="0" max="150"
                />
                {errors.age && <span className="form-error">{errors.age}</span>}
              </div>
              <div className="form-group">
                <label>Gender *</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">Select Gender</option>
                  {GENDER_OPTIONS.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
                {errors.gender && <span className="form-error">{errors.gender}</span>}
              </div>
              <div className="form-group">
                <label>Blood Group *</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                  <option value="">Select Blood Group</option>
                  {BLOOD_GROUP_OPTIONS.map((bg) => (
                    <option key={bg.value} value={bg.value}>{bg.label}</option>
                  ))}
                </select>
                {errors.bloodGroup && <span className="form-error">{errors.bloodGroup}</span>}
              </div>
              <div className="form-group">
                <label>Department *</label>
                <select name="department" value={form.department} onChange={handleChange}>
                  <option value="">Select Department</option>
                  {DEPARTMENT_OPTIONS.map((d) => (
                    <option key={d.value} value={d.value}>{d.label}</option>
                  ))}
                </select>
                {errors.department && <span className="form-error">{errors.department}</span>}
              </div>
              <div className="form-group full-width">
                <label>Diagnosis *</label>
                <input
                  type="text" name="diagnosis" value={form.diagnosis}
                  onChange={handleChange} placeholder="Primary diagnosis"
                />
                {errors.diagnosis && <span className="form-error">{errors.diagnosis}</span>}
              </div>
              <div className="form-group">
                <label>Doctor Name *</label>
                <input
                  type="text" name="doctorName" value={form.doctorName}
                  onChange={handleChange} placeholder="e.g., Dr. Smith"
                />
                {errors.doctorName && <span className="form-error">{errors.doctorName}</span>}
              </div>
              <div className="form-group">
                <label>Status *</label>
                <select name="status" value={form.status} onChange={handleChange}>
                  <option value="">Select Status</option>
                  {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
                {errors.status && <span className="form-error">{errors.status}</span>}
              </div>
              <div className="form-group">
                <label>Admission Date *</label>
                <input
                  type="date" name="admissionDate" value={form.admissionDate}
                  onChange={handleChange}
                />
                {errors.admissionDate && <span className="form-error">{errors.admissionDate}</span>}
              </div>
              <div className="form-group">
                <label>Discharge Date</label>
                <input
                  type="date" name="dischargeDate" value={form.dischargeDate}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group full-width">
                <label>Notes</label>
                <textarea
                  name="notes" value={form.notes} onChange={handleChange}
                  placeholder="Additional notes..."
                  rows={3}
                />
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading && <span className="btn-spinner" style={{ width: 16, height: 16, borderWidth: 2 }}></span>}
              {isEdit ? 'Update Record' : 'Save Record'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default MedicalRecordForm;
