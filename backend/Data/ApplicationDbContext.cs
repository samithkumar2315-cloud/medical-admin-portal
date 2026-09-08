using Microsoft.EntityFrameworkCore;
using MedicalAdminPortal.Models;

namespace MedicalAdminPortal.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<MedicalRecord> MedicalRecords { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.Property(e => e.Role).HasConversion<string>().HasMaxLength(30);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });

        // MedicalRecord configuration
        modelBuilder.Entity<MedicalRecord>(entity =>
        {
            entity.HasIndex(e => e.PatientId);
            entity.HasIndex(e => e.PatientName);
            entity.HasIndex(e => e.Department).HasDatabaseName("IX_MedicalRecords_Department");
            entity.HasIndex(e => e.Status).HasDatabaseName("IX_MedicalRecords_Status");
            entity.HasIndex(e => e.CreatedAt).HasDatabaseName("IX_MedicalRecords_CreatedAt");

            entity.Property(e => e.Gender).HasConversion<string>().HasMaxLength(10);
            entity.Property(e => e.BloodGroup).HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.Department).HasConversion<string>().HasMaxLength(30);
            entity.Property(e => e.Status).HasConversion<string>().HasMaxLength(20);
            entity.Property(e => e.CreatedAt).HasDefaultValueSql("GETUTCDATE()");
            entity.Property(e => e.UpdatedAt).HasDefaultValueSql("GETUTCDATE()");
        });
    }

    public override int SaveChanges()
    {
        UpdateTimestamps();
        return base.SaveChanges();
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        UpdateTimestamps();
        return base.SaveChangesAsync(cancellationToken);
    }

    private void UpdateTimestamps()
    {
        var entries = ChangeTracker.Entries()
            .Where(e => e.State == EntityState.Modified);

        foreach (var entry in entries)
        {
            if (entry.Entity is User user)
            {
                user.UpdatedAt = DateTime.UtcNow;
            }
            else if (entry.Entity is MedicalRecord record)
            {
                record.UpdatedAt = DateTime.UtcNow;
            }
        }
    }
}
