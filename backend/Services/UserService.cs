using Microsoft.EntityFrameworkCore;
using MedicalAdminPortal.Data;
using MedicalAdminPortal.DTOs;
using MedicalAdminPortal.Models;

namespace MedicalAdminPortal.Services;

public interface IUserService
{
    Task<UserProfileDto?> GetProfileAsync(int userId);
    Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileRequest request);
    Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request);
    Task<List<UserItemDto>> GetAllUsersAsync();
    Task<UserItemDto> CreateStaffUserAsync(CreateStaffUserRequest request);
}

public class UserService : IUserService
{
    private readonly ApplicationDbContext _context;

    public UserService(ApplicationDbContext context)
    {
        _context = context;
    }

    public async Task<List<UserItemDto>> GetAllUsersAsync()
    {
        var users = await _context.Users.OrderBy(u => u.Id).ToListAsync();
        return users.Select(u => new UserItemDto
        {
            Id = u.Id,
            Username = u.Username,
            FullName = u.FullName,
            Email = u.Email,
            Phone = u.Phone,
            Role = u.Role.ToString(),
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt
        }).ToList();
    }

    public async Task<UserItemDto> CreateStaffUserAsync(CreateStaffUserRequest request)
    {
        var roleEnum = Enum.TryParse<UserRole>(request.Role, true, out var r) ? r : UserRole.SubAdministrator;
        var user = new User
        {
            Username = request.Username.Trim(),
            PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
            FullName = request.FullName.Trim(),
            Email = request.Email?.Trim(),
            Phone = request.Phone?.Trim(),
            Role = roleEnum,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserItemDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }

    public async Task<UserProfileDto?> GetProfileAsync(int userId)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        return MapToDto(user);
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return null;

        user.FullName = request.FullName;
        user.Email = request.Email;
        user.Phone = request.Phone;
        user.ProfileImageUrl = request.ProfileImageUrl;
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();

        return MapToDto(user);
    }

    public async Task<bool> ChangePasswordAsync(int userId, ChangePasswordRequest request)
    {
        var user = await _context.Users.FindAsync(userId);
        if (user == null) return false;

        if (!BCrypt.Net.BCrypt.Verify(request.CurrentPassword, user.PasswordHash))
        {
            return false;
        }

        user.PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.NewPassword);
        user.UpdatedAt = DateTime.UtcNow;

        await _context.SaveChangesAsync();
        return true;
    }

    private static UserProfileDto MapToDto(User user)
    {
        return new UserProfileDto
        {
            Id = user.Id,
            Username = user.Username,
            FullName = user.FullName,
            Email = user.Email,
            Phone = user.Phone,
            ProfileImageUrl = user.ProfileImageUrl,
            Role = user.Role.ToString(),
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt
        };
    }
}
