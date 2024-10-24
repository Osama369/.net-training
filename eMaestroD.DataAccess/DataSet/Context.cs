using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace eMaestroD.DataAccess.DataSet
{
    public class Context : IdentityDbContext<IdentityUser>
    {
        public Context(DbContextOptions options) : base(options)
        {
        }
        public DbSet<Tenants> Tenants { get; set; }
        public DbSet<AuthorizationsTemplate> AuthorizationsTemplate { get; set; }
        public DbSet<Screens> Screens { get; set; }
        public DbSet<PaymentDetail> PaymentDetails { get; set; }
        public DbSet<TenantUser> TenantUsers { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
        }
    }

}
