using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace MedicalAdminPortal.Models;

public class MedicalRecord
{
    [Key]
    public int Id { get; set; }

    [Required]
    [MaxLength(20)]
    public string PatientId { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string PatientName { get; set; } = string.Empty;

    [Required]
    [Range(0, 150)]
    public int Age { get; set; }

    [Required]
    public Gender Gender { get; set; }

    [Required]
    public BloodGroup BloodGroup { get; set; }

    [Required]
    [MaxLength(200)]
    public string Diagnosis { get; set; } = string.Empty;

    [Required]
    [MaxLength(100)]
    public string DoctorName { get; set; } = string.Empty;

    [Required]
    public Department Department { get; set; }

    [Required]
    public DateTime AdmissionDate { get; set; }

    public DateTime? DischargeDate { get; set; }

    [Required]
    public RecordStatus Status { get; set; }

    [MaxLength(1000)]
    public string? Notes { get; set; }

    [Required]
    [MaxLength(50)]
    public string CreatedBy { get; set; } = string.Empty;

    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}
