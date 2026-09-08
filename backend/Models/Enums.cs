namespace MedicalAdminPortal.Models;

public enum UserRole
{
    Administrator,
    SubAdministrator
}

public enum Gender
{
    Male,
    Female,
    Other
}

public enum BloodGroup
{
    APositive,
    ANegative,
    BPositive,
    BNegative,
    ABPositive,
    ABNegative,
    OPositive,
    ONegative
}

public enum RecordStatus
{
    Active,
    Completed,
    Discharged,
    Pending,
    Cancelled
}

public enum Department
{
    GeneralMedicine,
    Cardiology,
    Neurology,
    Orthopedics,
    Pediatrics,
    Dermatology,
    Ophthalmology,
    ENT,
    Gynecology,
    Urology,
    Oncology,
    Psychiatry,
    Radiology,
    Pathology,
    EmergencyMedicine
}

public enum Permission
{
    VIEW_MEDICAL_DATA,
    CREATE_MEDICAL_DATA,
    EDIT_MEDICAL_DATA,
    DELETE_MEDICAL_DATA
}

public static class RolePermissions
{
    private static readonly Dictionary<UserRole, HashSet<Permission>> _permissions = new()
    {
        {
            UserRole.Administrator, new HashSet<Permission>
            {
                Permission.VIEW_MEDICAL_DATA
            }
        },
        {
            UserRole.SubAdministrator, new HashSet<Permission>
            {
                Permission.VIEW_MEDICAL_DATA,
                Permission.CREATE_MEDICAL_DATA,
                Permission.EDIT_MEDICAL_DATA,
                Permission.DELETE_MEDICAL_DATA
            }
        }
    };

    public static bool HasPermission(UserRole role, Permission permission)
    {
        return _permissions.TryGetValue(role, out var perms) && perms.Contains(permission);
    }

    public static IReadOnlySet<Permission> GetPermissions(UserRole role)
    {
        return _permissions.TryGetValue(role, out var perms) ? perms : new HashSet<Permission>();
    }
}
