using MemoryApp.Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace MemoryApp.Api.Data;

public class MemoryAppDbContext(DbContextOptions<MemoryAppDbContext> options) : IdentityDbContext<IdentityUser>(options)
{
    public DbSet<Word> Words => Set<Word>();
    public DbSet<WordSample> WordSamples => Set<WordSample>();
    public DbSet<UserWordProgress> UserWordProgresses => Set<UserWordProgress>();
    public DbSet<UserSettings> UserSettings => Set<UserSettings>();

    protected override void OnModelCreating(ModelBuilder builder)
    {
        base.OnModelCreating(builder);
    }
}
