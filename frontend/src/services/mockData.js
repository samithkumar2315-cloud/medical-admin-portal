// Initial mock database records matching SQL Server seed
export const initialRecords = [
  {
    id: 1,
    patientId: "P001",
    patientName: "John Doe",
    age: 45,
    gender: "Male",
    bloodGroup: "O+",
    diagnosis: "Type 2 Diabetes Mellitus",
    doctorName: "Dr. Smith",
    department: "General Medicine",
    admissionDate: "2024-01-15T00:00:00Z",
    dischargeDate: null,
    status: "Active",
    notes: "Patient requires regular blood sugar monitoring. Currently on Metformin 500mg twice daily.",
    createdBy: "subadmin",
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-01-15T10:00:00Z"
  },
  {
    id: 2,
    patientId: "P002",
    patientName: "Jane Smith",
    age: 32,
    gender: "Female",
    bloodGroup: "A+",
    diagnosis: "Essential Hypertension",
    doctorName: "Dr. Williams",
    department: "Cardiology",
    admissionDate: "2024-02-10T00:00:00Z",
    dischargeDate: "2024-02-18T00:00:00Z",
    status: "Completed",
    notes: "Blood pressure stabilized with Amlodipine 5mg. Follow-up in 3 months.",
    createdBy: "subadmin",
    createdAt: "2024-02-10T10:00:00Z",
    updatedAt: "2024-02-18T10:00:00Z"
  },
  {
    id: 3,
    patientId: "P003",
    patientName: "Robert Johnson",
    age: 58,
    gender: "Male",
    bloodGroup: "B+",
    diagnosis: "Lumbar Disc Herniation",
    doctorName: "Dr. Anderson",
    department: "Orthopedics",
    admissionDate: "2024-03-05T00:00:00Z",
    dischargeDate: null,
    status: "Active",
    notes: "Scheduled for minimally invasive discectomy. Pre-op labs completed.",
    createdBy: "subadmin",
    createdAt: "2024-03-05T10:00:00Z",
    updatedAt: "2024-03-05T10:00:00Z"
  },
  {
    id: 4,
    patientId: "P004",
    patientName: "Emily Davis",
    age: 7,
    gender: "Female",
    bloodGroup: "AB+",
    diagnosis: "Acute Bronchitis",
    doctorName: "Dr. Martinez",
    department: "Pediatrics",
    admissionDate: "2024-03-12T00:00:00Z",
    dischargeDate: "2024-03-15T00:00:00Z",
    status: "Discharged",
    notes: "Treated with antibiotics and bronchodilators. Full recovery expected.",
    createdBy: "subadmin",
    createdAt: "2024-03-12T10:00:00Z",
    updatedAt: "2024-03-15T10:00:00Z"
  },
  {
    id: 5,
    patientId: "P005",
    patientName: "Michael Wilson",
    age: 67,
    gender: "Male",
    bloodGroup: "O-",
    diagnosis: "Atrial Fibrillation",
    doctorName: "Dr. Thompson",
    department: "Cardiology",
    admissionDate: "2024-04-01T00:00:00Z",
    dischargeDate: null,
    status: "Active",
    notes: "Started on Warfarin therapy. INR monitoring required weekly.",
    createdBy: "subadmin",
    createdAt: "2024-04-01T10:00:00Z",
    updatedAt: "2024-04-01T10:00:00Z"
  },
  {
    id: 6,
    patientId: "P006",
    patientName: "Sarah Brown",
    age: 29,
    gender: "Female",
    bloodGroup: "A-",
    diagnosis: "Contact Dermatitis",
    doctorName: "Dr. Lee",
    department: "Dermatology",
    admissionDate: "2024-04-08T00:00:00Z",
    dischargeDate: "2024-04-09T00:00:00Z",
    status: "Completed",
    notes: "Allergic reaction to nickel. Prescribed topical corticosteroids.",
    createdBy: "subadmin",
    createdAt: "2024-04-08T10:00:00Z",
    updatedAt: "2024-04-09T10:00:00Z"
  },
  {
    id: 7,
    patientId: "P007",
    patientName: "David Garcia",
    age: 52,
    gender: "Male",
    bloodGroup: "B-",
    diagnosis: "Migraine with Aura",
    doctorName: "Dr. Patel",
    department: "Neurology",
    admissionDate: "2024-04-20T00:00:00Z",
    dischargeDate: null,
    status: "Active",
    notes: "Chronic migraine management. Started on Topiramate prophylaxis.",
    createdBy: "subadmin",
    createdAt: "2024-04-20T10:00:00Z",
    updatedAt: "2024-04-20T10:00:00Z"
  },
  {
    id: 8,
    patientId: "P008",
    patientName: "Lisa Martinez",
    age: 41,
    gender: "Female",
    bloodGroup: "O+",
    diagnosis: "Myopia with Astigmatism",
    doctorName: "Dr. Chen",
    department: "Ophthalmology",
    admissionDate: "2024-05-03T00:00:00Z",
    dischargeDate: "2024-05-03T00:00:00Z",
    status: "Completed",
    notes: "LASIK surgery performed successfully. Post-op review in 1 week.",
    createdBy: "subadmin",
    createdAt: "2024-05-03T10:00:00Z",
    updatedAt: "2024-05-03T10:00:00Z"
  },
  {
    id: 9,
    patientId: "P009",
    patientName: "James Taylor",
    age: 73,
    gender: "Male",
    bloodGroup: "AB-",
    diagnosis: "Benign Prostatic Hyperplasia",
    doctorName: "Dr. Robinson",
    department: "Urology",
    admissionDate: "2024-05-15T00:00:00Z",
    dischargeDate: null,
    status: "Pending",
    notes: "Awaiting TURP procedure. Currently on Tamsulosin.",
    createdBy: "subadmin",
    createdAt: "2024-05-15T10:00:00Z",
    updatedAt: "2024-05-15T10:00:00Z"
  },
  {
    id: 10,
    patientId: "P010",
    patientName: "Amanda White",
    age: 35,
    gender: "Female",
    bloodGroup: "A+",
    diagnosis: "Chronic Sinusitis",
    doctorName: "Dr. Kim",
    department: "ENT",
    admissionDate: "2024-05-22T00:00:00Z",
    dischargeDate: "2024-05-25T00:00:00Z",
    status: "Discharged",
    notes: "Functional endoscopic sinus surgery completed. Nasal irrigation prescribed.",
    createdBy: "subadmin",
    createdAt: "2024-05-22T10:00:00Z",
    updatedAt: "2024-05-25T10:00:00Z"
  },
  {
    id: 11,
    patientId: "P011",
    patientName: "Christopher Lee",
    age: 48,
    gender: "Male",
    bloodGroup: "B+",
    diagnosis: "Major Depressive Disorder",
    doctorName: "Dr. Evans",
    department: "Psychiatry",
    admissionDate: "2024-06-01T00:00:00Z",
    dischargeDate: null,
    status: "Active",
    notes: "Started on Sertraline 50mg. CBT sessions scheduled weekly.",
    createdBy: "subadmin",
    createdAt: "2024-06-01T10:00:00Z",
    updatedAt: "2024-06-01T10:00:00Z"
  },
  {
    id: 12,
    patientId: "P012",
    patientName: "Jennifer Clark",
    age: 55,
    gender: "Female",
    bloodGroup: "O+",
    diagnosis: "Invasive Ductal Carcinoma",
    doctorName: "Dr. Scott",
    department: "Oncology",
    admissionDate: "2024-06-10T00:00:00Z",
    dischargeDate: null,
    status: "Active",
    notes: "Stage II. Commencing adjuvant chemotherapy cycle 1.",
    createdBy: "subadmin",
    createdAt: "2024-06-10T10:00:00Z",
    updatedAt: "2024-06-10T10:00:00Z"
  },
  {
    id: 13,
    patientId: "P013",
    patientName: "Matthew Harris",
    age: 22,
    gender: "Male",
    bloodGroup: "A+",
    diagnosis: "Acute Appendicitis",
    doctorName: "Dr. Baker",
    department: "Emergency Medicine",
    admissionDate: "2024-06-18T00:00:00Z",
    dischargeDate: "2024-06-20T00:00:00Z",
    status: "Completed",
    notes: "Laparoscopic appendectomy performed. Recovery uneventful.",
    createdBy: "subadmin",
    createdAt: "2024-06-18T10:00:00Z",
    updatedAt: "2024-06-20T10:00:00Z"
  },
  {
    id: 14,
    patientId: "P014",
    patientName: "Jessica Lewis",
    age: 38,
    gender: "Female",
    bloodGroup: "B-",
    diagnosis: "Uterine Fibroids",
    doctorName: "Dr. Green",
    department: "Gynecology",
    admissionDate: "2024-07-02T00:00:00Z",
    dischargeDate: null,
    status: "Pending",
    notes: "Myomectomy scheduled for next week. Iron supplementation ongoing.",
    createdBy: "subadmin",
    createdAt: "2024-07-02T10:00:00Z",
    updatedAt: "2024-07-02T10:00:00Z"
  },
  {
    id: 15,
    patientId: "P015",
    patientName: "Daniel Young",
    age: 63,
    gender: "Male",
    bloodGroup: "O+",
    diagnosis: "Coronary Artery Disease",
    doctorName: "Dr. Williams",
    department: "Cardiology",
    admissionDate: "2024-07-15T00:00:00Z",
    dischargeDate: "2024-07-19T00:00:00Z",
    status: "Completed",
    notes: "Percutaneous coronary intervention with drug-eluting stent. Cardiac rehab enrolled.",
    createdBy: "subadmin",
    createdAt: "2024-07-15T10:00:00Z",
    updatedAt: "2024-07-19T10:00:00Z"
  }
];

export const initialUsers = [
  {
    id: 1,
    username: "admin",
    password: "Admin@123",
    fullName: "System Administrator",
    email: "admin@medportal.com",
    phone: "+1-555-0100",
    role: "Administrator",
    permissions: [
      "VIEW_MEDICAL_DATA",
      "SEARCH_FILTER_SORT",
      "VIEW_RECORD_DETAILS",
      "UPDATE_OWN_PROFILE",
      "CHANGE_PASSWORD"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  },
  {
    id: 2,
    username: "subadmin",
    password: "SubAdmin@123",
    fullName: "Sup Administrator",
    email: "subadmin@medportal.com",
    phone: "+1-555-0200",
    role: "SubAdministrator",
    permissions: [
      "VIEW_MEDICAL_DATA",
      "SEARCH_FILTER_SORT",
      "VIEW_RECORD_DETAILS",
      "CREATE_MEDICAL_DATA",
      "EDIT_MEDICAL_DATA",
      "DELETE_MEDICAL_DATA",
      "UPDATE_OWN_PROFILE",
      "CHANGE_PASSWORD"
    ],
    createdAt: "2024-01-01T00:00:00Z",
    updatedAt: "2024-01-01T00:00:00Z"
  }
];

// Helper to get records from localStorage
export const getStoredRecords = () => {
  const data = localStorage.getItem('medportal_records');
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* use default */ }
  }
  localStorage.setItem('medportal_records', JSON.stringify(initialRecords));
  return initialRecords;
};

export const saveStoredRecords = (records) => {
  localStorage.setItem('medportal_records', JSON.stringify(records));
};

export const getStoredUsers = () => {
  const data = localStorage.getItem('medportal_users');
  if (data) {
    try { return JSON.parse(data); } catch (e) { /* use default */ }
  }
  localStorage.setItem('medportal_users', JSON.stringify(initialUsers));
  return initialUsers;
};

export const saveStoredUsers = (users) => {
  localStorage.setItem('medportal_users', JSON.stringify(users));
};
