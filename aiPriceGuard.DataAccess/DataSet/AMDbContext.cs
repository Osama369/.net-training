using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.DataSet
{
    public class AMDbContext : IdentityDbContext<IdentityUser>
    {
        public AMDbContext(DbContextOptions options) : base(options)
        {
        }
       
        public DbSet<Companies> Companies { get; set; }
       
      //  public DbSet<Screens> Screens { get; set; }
        public DbSet<Users> Users { get; set; }
        public DbSet<Tenants> Tenants { get; set; }
        public DbSet<Authorizations> Authorizations { get; set; }
        public DbSet<Screens> Screens { get; set; }
        // public DbSet<Roles> Roles { get; set; }
        public DbSet<UserCompanies> UserCompanies { get; set; }
        //public DbSet<Currency> Currency { get; set; }
        //public DbSet<TimeZones> TimeZone { get; set; }
        public DbSet<EmailMessage> EmailMessage { get; set; }
        public DbSet<ConfigSetting> ConfigSettings { get; set; }
        public DbSet<UserLocation> UserLocations { get; set; }
        public DbSet<TenantUser> TenantUsers { get; set; }
        
        public DbSet<EmailTemplates> EmailTemplates { get; set; }
        public DbSet<UserDetailsViewModel> UserDetailsViewModel { get; set; }
        public DbSet<Supplier> Supplier { get; set; }
        public DbSet<CompanySupplier> CompanySupplier { get; set; }
        public DbSet<Product> Products { get; set; }
        public DbSet<ProductBarCode> ProductBarCodes { get; set; }
        public DbSet<SupplierProduct> SupplierProducts { get; set; }
        public DbSet<SupplierFile> SupplierFile { get; set; }
        public DbSet<FileModel> File { get; set; }

        public DbSet<Store> Stores { get; set; }
        public DbSet<Invoice> Invoice { get; set; }
        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
          
        }

    }
}
