using Microsoft.EntityFrameworkCore;
using MedicalAdminPortal.Data;
using MedicalAdminPortal.DTOs;
using MedicalAdminPortal.Models;

namespace MedicalAdminPortal.Services;

public interface IMedicalRecordService
{
    Task<PaginatedResult<MedicalRecordDto>> GetAllAsync(
        string? search, string? gender, string? bloodGroup,
        string? department, string? status, string? sortBy,
        string? sortOrder, int page, int pageSize);
    Task<MedicalRecordDto?> GetByIdAsync(int id);
    Task<MedicalRecordDto> CreateAsync(CreateMedicalRecordRequest request, string createdBy);
    Task<MedicalRecordDto?> UpdateAsync(int id, UpdateMedicalRecordRequest request);
    Task<bool> DeleteAsync(int id);
    Task<DashboardStatsDto> GetStatsAsync();
    Task<PaginatedResult<PatientSummaryDto>> GetPatientsAsync(string? search, int page, int pageSize);
    Task<PatientHistoryDto?> GetPatientHistoryAsync(string patientId);
    Task<AnalyticsDto> GetDetailedAnalyticsAsync();
    Task<List<MedicalRecordDto>> GetAllForExportAsync(string? search, string? department, string? status);
}

public class MedicalRecordService : IMedicalRecordService
{
    private readonly ApplicationDbContext _context;

    public MedicalRecordService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<PaginatedResult<MedicalRecordDto>> GetAllAsync(
        string? search, string? gender, string? bloodGroup,
        string? department, string? status, string? sortBy,
        string? sortOrder, int page, int pageSize)
    {
        var query = _context.MedicalRecords.AsQueryable();

        // Search
        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(r =>
                r.PatientName.ToLower().Contains(searchLower) ||
                r.PatientId.ToLower().Contains(searchLower) ||
                r.Diagnosis.ToLower().Contains(searchLower) ||
                r.DoctorName.ToLower().Contains(searchLower));
        }

        // Filters
        if (!string.IsNullOrWhiteSpace(gender) && Enum.TryParse<Gender>(gender, true, out var genderEnum))
        {
            query = query.Where(r => r.Gender == genderEnum);
        }

        if (!string.IsNullOrWhiteSpace(bloodGroup) && Enum.TryParse<BloodGroup>(bloodGroup, true, out var bgEnum))
        {
            query = query.Where(r => r.BloodGroup == bgEnum);
        }

        if (!string.IsNullOrWhiteSpace(department) && Enum.TryParse<Department>(department, true, out var deptEnum))
        {
            query = query.Where(r => r.Department == deptEnum);
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<RecordStatus>(status, true, out var statusEnum))
        {
            query = query.Where(r => r.Status == statusEnum);
        }

        // Total count before pagination
        var totalCount = await query.CountAsync();

        // Sorting
        query = (sortBy?.ToLower(), sortOrder?.ToLower()) switch
        {
            ("patientname", "asc") => query.OrderBy(r => r.PatientName),
            ("patientname", _) => query.OrderByDescending(r => r.PatientName),
            ("age", "asc") => query.OrderBy(r => r.Age),
            ("age", _) => query.OrderByDescending(r => r.Age),
            ("admissiondate", "asc") => query.OrderBy(r => r.AdmissionDate),
            ("admissiondate", _) => query.OrderByDescending(r => r.AdmissionDate),
            ("department", "asc") => query.OrderBy(r => r.Department),
            ("department", _) => query.OrderByDescending(r => r.Department),
            ("createdat", "asc") => query.OrderBy(r => r.CreatedAt),
            ("createdat", _) => query.OrderByDescending(r => r.CreatedAt),
            ("status", "asc") => query.OrderBy(r => r.Status),
            ("status", _) => query.OrderByDescending(r => r.Status),
            _ => query.OrderByDescending(r => r.CreatedAt)
        };

        // Pagination
        var items = await query
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .Select(r => MapToDto(r))
            .ToListAsync();

        return new PaginatedResult<MedicalRecordDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<MedicalRecordDto?> GetByIdAsync(int id)
    {
        var record = await _context.MedicalRecords.FindAsync(id);
        return record == null ? null : MapToDto(record);
    }

    public async Task<MedicalRecordDto> CreateAsync(CreateMedicalRecordRequest request, string createdBy)
    {
        var record = new MedicalRecord
        {
            PatientId = request.PatientId,
            PatientName = request.PatientName,
            Age = request.Age,
            Gender = Enum.Parse<Gender>(request.Gender, true),
            BloodGroup = Enum.Parse<BloodGroup>(request.BloodGroup, true),
            Diagnosis = request.Diagnosis,
            DoctorName = request.DoctorName,
            Department = Enum.Parse<Department>(request.Department, true),
            AdmissionDate = request.AdmissionDate,
            DischargeDate = request.DischargeDate,
            Status = Enum.Parse<RecordStatus>(request.Status, true),
            Notes = request.Notes,
            CreatedBy = createdBy,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.MedicalRecords.Add(record);
        await _context.SaveChangesAsync();

        return MapToDto(record);
    }

    public async Task<MedicalRecordDto?> UpdateAsync(int id, UpdateMedicalRecordRequest request)
    {
        var record = await _context.MedicalRecords.FindAsync(id);
        if (record == null) return null;

        record.PatientId = request.PatientId;
        record.PatientName = request.PatientName;
        record.Age = request.Age;
        record.Gender = Enum.Parse<Gender>(request.Gender, true);
        record.BloodGroup = Enum.Parse<BloodGroup>(request.BloodGroup, true);
        record.Diagnosis = request.Diagnosis;
        record.DoctorName = request.DoctorName;
        record.Department = Enum.Parse<Department>(request.Department, true);
        record.AdmissionDate = request.AdmissionDate;
        record.DischargeDate = request.DischargeDate;
        record.Status = Enum.Parse<RecordStatus>(request.Status, true);
        record.Notes = request.Notes;
        record.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(record);
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var record = await _context.MedicalRecords.FindAsync(id);
        if (record == null) return false;

        _context.MedicalRecords.Remove(record);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<DashboardStatsDto> GetStatsAsync()
    {
        var records = _context.MedicalRecords;

        return new DashboardStatsDto
        {
            TotalRecords = await records.CountAsync(),
            ActivePatients = await records.CountAsync(r => r.Status == RecordStatus.Active),
            CompletedCases = await records.CountAsync(r => r.Status == RecordStatus.Completed),
            DischargedPatients = await records.CountAsync(r => r.Status == RecordStatus.Discharged),
            PendingCases = await records.CountAsync(r => r.Status == RecordStatus.Pending),
            TotalDepartments = await records.Select(r => r.Department).Distinct().CountAsync()
        };
    }

    public async Task<PaginatedResult<PatientSummaryDto>> GetPatientsAsync(string? search, int page, int pageSize)
    {
        var records = await _context.MedicalRecords.ToListAsync();

        var grouped = records
            .GroupBy(r => r.PatientId)
            .Select(g =>
            {
                var latest = g.OrderByDescending(r => r.AdmissionDate).First();
                return new PatientSummaryDto
                {
                    PatientId = g.Key,
                    PatientName = latest.PatientName,
                    Age = latest.Age,
                    Gender = latest.Gender.ToString(),
                    BloodGroup = FormatBloodGroup(latest.BloodGroup),
                    RecordCount = g.Count(),
                    LatestAdmissionDate = latest.AdmissionDate,
                    LatestStatus = latest.Status.ToString(),
                    LatestDiagnosis = latest.Diagnosis,
                    LatestDoctor = latest.DoctorName,
                    Department = FormatDepartment(latest.Department)
                };
            })
            .AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var s = search.ToLower();
            grouped = grouped.Where(p =>
                p.PatientName.ToLower().Contains(s) ||
                p.PatientId.ToLower().Contains(s) ||
                p.LatestDiagnosis.ToLower().Contains(s) ||
                p.LatestDoctor.ToLower().Contains(s));
        }

        var totalCount = grouped.Count();
        var items = grouped
            .OrderByDescending(p => p.LatestAdmissionDate)
            .Skip((page - 1) * pageSize)
            .Take(pageSize)
            .ToList();

        return new PaginatedResult<PatientSummaryDto>
        {
            Items = items,
            TotalCount = totalCount,
            Page = page,
            PageSize = pageSize
        };
    }

    public async Task<PatientHistoryDto?> GetPatientHistoryAsync(string patientId)
    {
        var records = await _context.MedicalRecords
            .Where(r => r.PatientId == patientId)
            .OrderByDescending(r => r.AdmissionDate)
            .ToListAsync();

        if (!records.Any()) return null;

        var latest = records.First();
        var summary = new PatientSummaryDto
        {
            PatientId = latest.PatientId,
            PatientName = latest.PatientName,
            Age = latest.Age,
            Gender = latest.Gender.ToString(),
            BloodGroup = FormatBloodGroup(latest.BloodGroup),
            RecordCount = records.Count,
            LatestAdmissionDate = latest.AdmissionDate,
            LatestStatus = latest.Status.ToString(),
            LatestDiagnosis = latest.Diagnosis,
            LatestDoctor = latest.DoctorName,
            Department = FormatDepartment(latest.Department)
        };

        return new PatientHistoryDto
        {
            Summary = summary,
            Records = records.Select(MapToDto).ToList()
        };
    }

    public async Task<AnalyticsDto> GetDetailedAnalyticsAsync()
    {
        var records = await _context.MedicalRecords.ToListAsync();
        var total = records.Count;
        var totalPatients = records.Select(r => r.PatientId).Distinct().Count();

        var deptGroups = records.GroupBy(r => r.Department)
            .Select(g => new NameCountDto
            {
                Name = FormatDepartment(g.Key),
                Count = g.Count(),
                Percentage = total > 0 ? Math.Round((double)g.Count() / total * 100, 1) : 0
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        var statusGroups = records.GroupBy(r => r.Status)
            .Select(g => new NameCountDto
            {
                Name = g.Key.ToString(),
                Count = g.Count(),
                Percentage = total > 0 ? Math.Round((double)g.Count() / total * 100, 1) : 0
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        var genderGroups = records.GroupBy(r => r.Gender)
            .Select(g => new NameCountDto
            {
                Name = g.Key.ToString(),
                Count = g.Count(),
                Percentage = total > 0 ? Math.Round((double)g.Count() / total * 100, 1) : 0
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        var bloodGroups = records.GroupBy(r => r.BloodGroup)
            .Select(g => new NameCountDto
            {
                Name = FormatBloodGroup(g.Key),
                Count = g.Count(),
                Percentage = total > 0 ? Math.Round((double)g.Count() / total * 100, 1) : 0
            })
            .OrderByDescending(x => x.Count)
            .ToList();

        var ageGroups = new List<NameCountDto>
        {
            new() { Name = "0-18 (Pediatric)", Count = records.Count(r => r.Age <= 18) },
            new() { Name = "19-35 (Young Adult)", Count = records.Count(r => r.Age >= 19 && r.Age <= 35) },
            new() { Name = "36-50 (Middle Age)", Count = records.Count(r => r.Age >= 36 && r.Age <= 50) },
            new() { Name = "51-65 (Mature Adult)", Count = records.Count(r => r.Age >= 51 && r.Age <= 65) },
            new() { Name = "65+ (Senior)", Count = records.Count(r => r.Age > 65) }
        };
        foreach (var ag in ageGroups)
        {
            ag.Percentage = total > 0 ? Math.Round((double)ag.Count / total * 100, 1) : 0;
        }

        return new AnalyticsDto
        {
            TotalRecords = total,
            TotalPatients = totalPatients,
            ActiveCases = records.Count(r => r.Status == RecordStatus.Active),
            CompletedCases = records.Count(r => r.Status == RecordStatus.Completed),
            DischargedCases = records.Count(r => r.Status == RecordStatus.Discharged),
            PendingCases = records.Count(r => r.Status == RecordStatus.Pending),
            DepartmentDistribution = deptGroups,
            StatusDistribution = statusGroups,
            GenderDistribution = genderGroups,
            BloodGroupDistribution = bloodGroups,
            AgeGroupDistribution = ageGroups
        };
    }

    public async Task<List<MedicalRecordDto>> GetAllForExportAsync(string? search, string? department, string? status)
    {
        var query = _context.MedicalRecords.AsQueryable();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var searchLower = search.ToLower();
            query = query.Where(r =>
                r.PatientName.ToLower().Contains(searchLower) ||
                r.PatientId.ToLower().Contains(searchLower) ||
                r.Diagnosis.ToLower().Contains(searchLower) ||
                r.DoctorName.ToLower().Contains(searchLower));
        }

        if (!string.IsNullOrWhiteSpace(department) && Enum.TryParse<Department>(department, true, out var deptEnum))
        {
            query = query.Where(r => r.Department == deptEnum);
        }

        if (!string.IsNullOrWhiteSpace(status) && Enum.TryParse<RecordStatus>(status, true, out var statusEnum))
        {
            query = query.Where(r => r.Status == statusEnum);
        }

        var list = await query.OrderByDescending(r => r.AdmissionDate).Take(1000).ToListAsync();
        return list.Select(MapToDto).ToList();
    }

    private static MedicalRecordDto MapToDto(MedicalRecord record)
    {
        return new MedicalRecordDto
        {
            Id = record.Id,
            PatientId = record.PatientId,
            PatientName = record.PatientName,
            Age = record.Age,
            Gender = record.Gender.ToString(),
            BloodGroup = FormatBloodGroup(record.BloodGroup),
            Diagnosis = record.Diagnosis,
            DoctorName = record.DoctorName,
            Department = FormatDepartment(record.Department),
            AdmissionDate = record.AdmissionDate,
            DischargeDate = record.DischargeDate,
            Status = record.Status.ToString(),
            Notes = record.Notes,
            CreatedBy = record.CreatedBy,
            CreatedAt = record.CreatedAt,
            UpdatedAt = record.UpdatedAt
        };
    }

    private static string FormatBloodGroup(BloodGroup bg)
    {
        return bg switch
        {
            BloodGroup.APositive => "A+",
            BloodGroup.ANegative => "A-",
            BloodGroup.BPositive => "B+",
            BloodGroup.BNegative => "B-",
            BloodGroup.ABPositive => "AB+",
            BloodGroup.ABNegative => "AB-",
            BloodGroup.OPositive => "O+",
            BloodGroup.ONegative => "O-",
            _ => bg.ToString()
        };
    }

    private static string FormatDepartment(Department dept)
    {
        return dept switch
        {
            Department.GeneralMedicine => "General Medicine",
            Department.EmergencyMedicine => "Emergency Medicine",
            _ => System.Text.RegularExpressions.Regex.Replace(dept.ToString(), "(\\B[A-Z])", " $1")
        };
    }
}
