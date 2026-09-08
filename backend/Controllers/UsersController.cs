using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MedicalAdminPortal.DTOs;
using MedicalAdminPortal.Services;

namespace MedicalAdminPortal.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get all users in the system (Administrator only)
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType(typeof(List<UserItemDto>), StatusCodes.Status200OK)]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAllUsersAsync();
        return Ok(users);
    }

    /// <summary>
    /// Create a new staff / subadmin user (Administrator only)
    /// </summary>
    [HttpPost("staff")]
    [Authorize(Roles = "Administrator")]
    [ProducesResponseType(typeof(UserItemDto), StatusCodes.Status201Created)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> CreateStaff([FromBody] CreateStaffUserRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        try
        {
            var user = await _userService.CreateStaffUserAsync(request);
            return CreatedAtAction(nameof(GetAll), new { id = user.Id }, user);
        }
        catch (Exception ex)
        {
            return BadRequest(new { message = ex.Message.Contains("UNIQUE") || ex.Message.Contains("duplicate") ? "Username already exists." : "Failed to create user." });
        }
    }

    /// <summary>
    /// Get current user's profile
    /// </summary>
    [HttpGet("profile")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetProfile()
    {
        var userId = GetCurrentUserId();
        var profile = await _userService.GetProfileAsync(userId);

        if (profile == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(profile);
    }

    /// <summary>
    /// Update current user's profile
    /// </summary>
    [HttpPut("profile")]
    [ProducesResponseType(typeof(UserProfileDto), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetCurrentUserId();
        var profile = await _userService.UpdateProfileAsync(userId, request);

        if (profile == null)
        {
            return NotFound(new { message = "User not found." });
        }

        return Ok(profile);
    }

    /// <summary>
    /// Change current user's password
    /// </summary>
    [HttpPost("change-password")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status400BadRequest)]
    public async Task<IActionResult> ChangePassword([FromBody] ChangePasswordRequest request)
    {
        if (!ModelState.IsValid)
        {
            return BadRequest(ModelState);
        }

        var userId = GetCurrentUserId();
        var result = await _userService.ChangePasswordAsync(userId, request);

        if (!result)
        {
            return BadRequest(new { message = "Current password is incorrect." });
        }

        return Ok(new { message = "Password changed successfully." });
    }

    private int GetCurrentUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return int.Parse(userIdClaim!);
    }
}
