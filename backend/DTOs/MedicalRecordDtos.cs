using System.ComponentModel.DataAnnotations;

namespace MedicalAdminPortal.DTOs;

public class MedicalRecordDto
{
    public int Id { get; set; }
    public string PatientId { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public string Diagnosis { get; set; } = string.Empty;
    public string DoctorName { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
    public DateTime AdmissionDate { get; set; }
    public DateTime? DischargeDate { get; set; }
    public string Status { get; set; } = string.Empty;
    public string? Notes { get; set; }
    public string CreatedBy { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}

public class CreateMedicalRecordRequest
{
    [Required(ErrorMessage = "Patient ID is required")]
    [MaxLength(20)]
    public string PatientId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Patient name is required")]
    [MaxLength(100)]
    public string PatientName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Age is required")]
    [Range(0, 150, ErrorMessage = "Age must be between 0 and 150")]
    public int Age { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; } = string.Empty;

    [Required(ErrorMessage = "Blood group is required")]
    public string BloodGroup { get; set; } = string.Empty;

    [Required(ErrorMessage = "Diagnosis is required")]
    [MaxLength(200)]
    public string Diagnosis { get; set; } = string.Empty;

    [Required(ErrorMessage = "Doctor name is required")]
    [MaxLength(100)]
    public string DoctorName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department is required")]
    public string Department { get; set; } = string.Empty;

    [Required(ErrorMessage = "Admission date is required")]
    public DateTime AdmissionDate { get; set; }

    public DateTime? DischargeDate { get; set; }

    [Required(ErrorMessage = "Status is required")]
    public string Status { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public class UpdateMedicalRecordRequest
{
    [Required(ErrorMessage = "Patient ID is required")]
    [MaxLength(20)]
    public string PatientId { get; set; } = string.Empty;

    [Required(ErrorMessage = "Patient name is required")]
    [MaxLength(100)]
    public string PatientName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Age is required")]
    [Range(0, 150, ErrorMessage = "Age must be between 0 and 150")]
    public int Age { get; set; }

    [Required(ErrorMessage = "Gender is required")]
    public string Gender { get; set; } = string.Empty;

    [Required(ErrorMessage = "Blood group is required")]
    public string BloodGroup { get; set; } = string.Empty;

    [Required(ErrorMessage = "Diagnosis is required")]
    [MaxLength(200)]
    public string Diagnosis { get; set; } = string.Empty;

    [Required(ErrorMessage = "Doctor name is required")]
    [MaxLength(100)]
    public string DoctorName { get; set; } = string.Empty;

    [Required(ErrorMessage = "Department is required")]
    public string Department { get; set; } = string.Empty;

    [Required(ErrorMessage = "Admission date is required")]
    public DateTime AdmissionDate { get; set; }

    public DateTime? DischargeDate { get; set; }

    [Required(ErrorMessage = "Status is required")]
    public string Status { get; set; } = string.Empty;

    [MaxLength(1000)]
    public string? Notes { get; set; }
}

public class DashboardStatsDto
{
    public int TotalRecords { get; set; }
    public int ActivePatients { get; set; }
    public int CompletedCases { get; set; }
    public int TotalDepartments { get; set; }
    public int DischargedPatients { get; set; }
    public int PendingCases { get; set; }
}

public class PaginatedResult<T>
{
    public List<T> Items { get; set; } = new();
    public int TotalCount { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
    public int TotalPages => (int)Math.Ceiling((double)TotalCount / PageSize);
    public bool HasPrevious => Page > 1;
    public bool HasNext => Page < TotalPages;
}

public class PatientSummaryDto
{
    public string PatientId { get; set; } = string.Empty;
    public string PatientName { get; set; } = string.Empty;
    public int Age { get; set; }
    public string Gender { get; set; } = string.Empty;
    public string BloodGroup { get; set; } = string.Empty;
    public int RecordCount { get; set; }
    public DateTime LatestAdmissionDate { get; set; }
    public string LatestStatus { get; set; } = string.Empty;
    public string LatestDiagnosis { get; set; } = string.Empty;
    public string LatestDoctor { get; set; } = string.Empty;
    public string Department { get; set; } = string.Empty;
}

public class PatientHistoryDto
{
    public PatientSummaryDto Summary { get; set; } = new();
    public List<MedicalRecordDto> Records { get; set; } = new();
}

public class NameCountDto
{
    public string Name { get; set; } = string.Empty;
    public int Count { get; set; }
    public double Percentage { get; set; }
}

public class AnalyticsDto
{
    public int TotalRecords { get; set; }
    public int TotalPatients { get; set; }
    public int ActiveCases { get; set; }
    public int CompletedCases { get; set; }
    public int DischargedCases { get; set; }
    public int PendingCases { get; set; }
    public List<NameCountDto> DepartmentDistribution { get; set; } = new();
    public List<NameCountDto> StatusDistribution { get; set; } = new();
    public List<NameCountDto> GenderDistribution { get; set; } = new();
    public List<NameCountDto> BloodGroupDistribution { get; set; } = new();
    public List<NameCountDto> AgeGroupDistribution { get; set; } = new();
}

