using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedicalAdminPortal.DTOs;
using MedicalAdminPortal.Services;

namespace MedicalAdminPortal.Controllers;

[ApiController]
[Route("api/medical-records")]
[Authorize]
public class MedicalRecordsController : ControllerBase
{
    private readonly IMedicalRecordService _medicalRecordService;

    public MedicalRecordsController(IMedicalRecordService medicalRecordService)
    {
        _medicalRecordService = medicalRecordService;
    }

    /// <summary>
    /// Get all medical records with search, filter, sort, and pagination
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(PaginatedResult<MedicalRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll(
        [FromQuery] string? search,
        [FromQuery] string? gender,
        [FromQuery] string? bloodGroup,
        [FromQuery] string? department,
        [FromQuery] string? status,
        [FromQuery] string? sortBy,
        [FromQuery] string? sortOrder,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var result = await _medicalRecordService.GetAllAsync(
            search, gender, bloodGroup, department, status,
            sortBy, sortOrder, page, pageSize);

        return Ok(result);
    }

    /// <summary>
    /// Get dashboard statistics
    /// </summary>
    [HttpGet("stats")]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(DashboardStatsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetStats()
    {
        var stats = await _medicalRecordService.GetStatsAsync();
        return Ok(stats);
    }

    /// <summary>
    /// Get detailed analytics data for charts and reports
    /// </summary>
    [HttpGet("analytics")]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(AnalyticsDto), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAnalytics()
    {
        var analytics = await _medicalRecordService.GetDetailedAnalyticsAsync();
        return Ok(analytics);
    }

    /// <summary>
    /// Get list of patients grouped with latest clinical summary
    /// </summary>
    [HttpGet("patients")]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(PaginatedResult<PatientSummaryDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetPatients(
        [FromQuery] string? search,
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 10)
    {
        if (page < 1) page = 1;
        if (pageSize < 1) pageSize = 10;
        if (pageSize > 100) pageSize = 100;

        var result = await _medicalRecordService.GetPatientsAsync(search, page, pageSize);
        return Ok(result);
    }

    /// <summary>
    /// Get comprehensive medical history for a specific patient
    /// </summary>
    [HttpGet("patients/{patientId}")]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(PatientHistoryDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPatientHistory(string patientId)
    {
        var history = await _medicalRecordService.GetPatientHistoryAsync(patientId);
        if (history == null)
        {
            return NotFound(new { message = "Patient not found." });
        }
        return Ok(history);
    }

    /// <summary>
    /// Export medical records for CSV download
    /// </summary>
    [HttpGet("export")]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(List<MedicalRecordDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> Export(
        [FromQuery] string? search,
        [FromQuery] string? department,
        [FromQuery] string? status)
    {
        var list = await _medicalRecordService.GetAllForExportAsync(search, department, status);
        return Ok(list);
    }

    /// <summary>
    /// Get a specific medical record by ID
    /// </summary>
    [HttpGet("{id:int}")]
    [Authorize(Roles = "Administrator,SubAdministrator")]
    [ProducesResponseType(typeof(MedicalRecordDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetById(int id)
    {
        var record = await _medicalRecordService.GetByIdAsync(id);

        if (record == null)
        {
            return NotFound(new { message = "Medical record not found." });
        }

        return Ok(record);
    }

    /// <summary>
    /// Create a new medical record (SubAdministrator only)
    /// </summary>
    [HttpPost]
    [Authorize(Roles = "SubAdministrator")]
    [ProducesResponseType(typeof(MedicalRecordDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> Create([FromBody] CreateMedicalRecordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var username = User.FindFirst(ClaimTypes.Name)?.Value ?? "unknown";
        var record = await _medicalRecordService.CreateAsync(request, username);

        return CreatedAtAction(nameof(GetById), new { id = record.Id }, record);
    }

    /// <summary>
    /// Update an existing medical record (SubAdministrator only)
    /// </summary>
    [HttpPut("{id}")]
    [Authorize(Roles = "SubAdministrator")]
    [ProducesResponseType(typeof(MedicalRecordDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Update(int id, [FromBody] UpdateMedicalRecordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var record = await _medicalRecordService.UpdateAsync(id, request);

        if (record == null)
        {
            return NotFound(new { message = "Medical record not found." });
        }

        return Ok(record);
    }

    /// <summary>
    /// Delete a medical record (SubAdministrator only)
    /// </summary>
    [HttpDelete("{id}")]
    [Authorize(Roles = "SubAdministrator")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Delete(int id)
    {
        var result = await _medicalRecordService.DeleteAsync(id);

        if (!result)
        {
            return NotFound(new { message = "Medical record not found." });
        }

        return Ok(new { message = "Medical record deleted successfully." });
    }
}
