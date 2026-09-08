using MedicalAdminPortal.Models;
using BCrypt.Net;

namespace MedicalAdminPortal.Data;

public static class DbSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        SeedUsers(context);
        SeedMedicalRecords(context);
    }

    private static void SeedUsers(ApplicationDbContext context)
    {
        if (context.Users.Any()) return;

        var users = new List<User>
        {
            new User
            {
                Username = "admin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("Admin@123"),
                FullName = "System Administrator",
                Email = "admin@medportal.com",
                Phone = "+1-555-0100",
                Role = UserRole.Administrator,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new User
            {
                Username = "subadmin",
                PasswordHash = BCrypt.Net.BCrypt.HashPassword("SubAdmin@123"),
                FullName = "Sub Administrator",
                Email = "subadmin@medportal.com",
                Phone = "+1-555-0200",
                Role = UserRole.SubAdministrator,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.Users.AddRange(users);
        context.SaveChanges();
    }

    private static void SeedMedicalRecords(ApplicationDbContext context)
    {
        if (context.MedicalRecords.Any()) return;

        var records = new List<MedicalRecord>
        {
            new MedicalRecord
            {
                PatientId = "P001",
                PatientName = "John Doe",
                Age = 45,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.OPositive,
                Diagnosis = "Type 2 Diabetes Mellitus",
                DoctorName = "Dr. Smith",
                Department = Department.GeneralMedicine,
                AdmissionDate = new DateTime(2024, 1, 15),
                Status = RecordStatus.Active,
                Notes = "Patient requires regular blood sugar monitoring. Currently on Metformin 500mg twice daily.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P002",
                PatientName = "Jane Smith",
                Age = 32,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.APositive,
                Diagnosis = "Essential Hypertension",
                DoctorName = "Dr. Williams",
                Department = Department.Cardiology,
                AdmissionDate = new DateTime(2024, 2, 10),
                DischargeDate = new DateTime(2024, 2, 18),
                Status = RecordStatus.Completed,
                Notes = "Blood pressure stabilized with Amlodipine 5mg. Follow-up in 3 months.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P003",
                PatientName = "Robert Johnson",
                Age = 58,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.BPositive,
                Diagnosis = "Lumbar Disc Herniation",
                DoctorName = "Dr. Anderson",
                Department = Department.Orthopedics,
                AdmissionDate = new DateTime(2024, 3, 5),
                Status = RecordStatus.Active,
                Notes = "Scheduled for minimally invasive discectomy. Pre-op labs completed.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P004",
                PatientName = "Emily Davis",
                Age = 7,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.ABPositive,
                Diagnosis = "Acute Bronchitis",
                DoctorName = "Dr. Martinez",
                Department = Department.Pediatrics,
                AdmissionDate = new DateTime(2024, 3, 12),
                DischargeDate = new DateTime(2024, 3, 15),
                Status = RecordStatus.Discharged,
                Notes = "Treated with antibiotics and bronchodilators. Full recovery expected.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P005",
                PatientName = "Michael Wilson",
                Age = 67,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.ONegative,
                Diagnosis = "Atrial Fibrillation",
                DoctorName = "Dr. Thompson",
                Department = Department.Cardiology,
                AdmissionDate = new DateTime(2024, 4, 1),
                Status = RecordStatus.Active,
                Notes = "Started on Warfarin therapy. INR monitoring required weekly.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P006",
                PatientName = "Sarah Brown",
                Age = 29,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.ANegative,
                Diagnosis = "Contact Dermatitis",
                DoctorName = "Dr. Lee",
                Department = Department.Dermatology,
                AdmissionDate = new DateTime(2024, 4, 8),
                DischargeDate = new DateTime(2024, 4, 9),
                Status = RecordStatus.Completed,
                Notes = "Allergic reaction to nickel. Prescribed topical corticosteroids.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P007",
                PatientName = "David Garcia",
                Age = 52,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.BNegative,
                Diagnosis = "Migraine with Aura",
                DoctorName = "Dr. Patel",
                Department = Department.Neurology,
                AdmissionDate = new DateTime(2024, 4, 20),
                Status = RecordStatus.Active,
                Notes = "Chronic migraine management. Started on Topiramate prophylaxis.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P008",
                PatientName = "Lisa Martinez",
                Age = 41,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.OPositive,
                Diagnosis = "Myopia with Astigmatism",
                DoctorName = "Dr. Chen",
                Department = Department.Ophthalmology,
                AdmissionDate = new DateTime(2024, 5, 3),
                DischargeDate = new DateTime(2024, 5, 3),
                Status = RecordStatus.Completed,
                Notes = "LASIK surgery performed successfully. Post-op review in 1 week.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P009",
                PatientName = "James Taylor",
                Age = 73,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.ABNegative,
                Diagnosis = "Benign Prostatic Hyperplasia",
                DoctorName = "Dr. Robinson",
                Department = Department.Urology,
                AdmissionDate = new DateTime(2024, 5, 15),
                Status = RecordStatus.Pending,
                Notes = "Awaiting TURP procedure. Currently on Tamsulosin.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P010",
                PatientName = "Amanda White",
                Age = 35,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.APositive,
                Diagnosis = "Chronic Sinusitis",
                DoctorName = "Dr. Kim",
                Department = Department.ENT,
                AdmissionDate = new DateTime(2024, 5, 22),
                DischargeDate = new DateTime(2024, 5, 25),
                Status = RecordStatus.Discharged,
                Notes = "Functional endoscopic sinus surgery completed. Nasal irrigation prescribed.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P011",
                PatientName = "Christopher Lee",
                Age = 48,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.BPositive,
                Diagnosis = "Major Depressive Disorder",
                DoctorName = "Dr. Evans",
                Department = Department.Psychiatry,
                AdmissionDate = new DateTime(2024, 6, 1),
                Status = RecordStatus.Active,
                Notes = "Started on Sertraline 50mg. CBT sessions scheduled weekly.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P012",
                PatientName = "Jennifer Clark",
                Age = 55,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.OPositive,
                Diagnosis = "Early-stage Breast Carcinoma",
                DoctorName = "Dr. Nguyen",
                Department = Department.Oncology,
                AdmissionDate = new DateTime(2024, 6, 10),
                Status = RecordStatus.Active,
                Notes = "Stage I, hormone receptor positive. Lumpectomy followed by radiation therapy planned.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P013",
                PatientName = "Daniel Harris",
                Age = 62,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.APositive,
                Diagnosis = "Acute Appendicitis",
                DoctorName = "Dr. Smith",
                Department = Department.GeneralMedicine,
                AdmissionDate = new DateTime(2024, 6, 18),
                DischargeDate = new DateTime(2024, 6, 21),
                Status = RecordStatus.Discharged,
                Notes = "Laparoscopic appendectomy performed. Uneventful recovery.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P014",
                PatientName = "Sophia Walker",
                Age = 4,
                Gender = Gender.Female,
                BloodGroup = BloodGroup.BPositive,
                Diagnosis = "Febrile Seizures",
                DoctorName = "Dr. Martinez",
                Department = Department.Pediatrics,
                AdmissionDate = new DateTime(2024, 7, 2),
                DischargeDate = new DateTime(2024, 7, 4),
                Status = RecordStatus.Completed,
                Notes = "Seizures resolved. Parents educated on fever management. No anticonvulsant therapy needed.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            },
            new MedicalRecord
            {
                PatientId = "P015",
                PatientName = "William King",
                Age = 39,
                Gender = Gender.Male,
                BloodGroup = BloodGroup.ONegative,
                Diagnosis = "Fractured Right Femur",
                DoctorName = "Dr. Anderson",
                Department = Department.Orthopedics,
                AdmissionDate = new DateTime(2024, 7, 10),
                Status = RecordStatus.Active,
                Notes = "Open reduction internal fixation performed. Physical therapy to commence in 2 weeks.",
                CreatedBy = "subadmin",
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            }
        };

        context.MedicalRecords.AddRange(records);
        context.SaveChanges();
    }
}
