using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using eMaestroD.Api.Models;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Data
{
    public class CustomDbContextFactory
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly ConnectionStringsDictionary _ConnectionStringsDictionary;
        private CustomMethod cm = new CustomMethod();
        public CustomDbContextFactory(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, ConnectionStringsDictionary ConnectionStringsDictionary)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _ConnectionStringsDictionary = ConnectionStringsDictionary;
        }

        public AMDbContext CreateDbContext()
        {

            var connectionString = GetConnectionString();
            var optionsBuilder = new DbContextOptionsBuilder<AMDbContext>();
            optionsBuilder.UseSqlServer(connectionString);
            optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
            var tenantsID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Upn);
            if (tenantsID != null)
            {
                using (var dbContext = new AMDbContext(optionsBuilder.Options))
                {
                    var conString = dbContext.Tenants.Where(x => x.tenantID == int.Parse(cm.Decrypt(tenantsID))).ToList();
                    if (conString.Count > 0)
                    {
                        var optionsBuilder1 = new DbContextOptionsBuilder<AMDbContext>();
                        optionsBuilder1.UseSqlServer(cm.Decrypt(conString[0].connectionString));
                        optionsBuilder1.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
                        //UserConnections.Add(conString, tenantsID);
                        return new AMDbContext(optionsBuilder1.Options);
                    }
                }
            }
            return new AMDbContext(optionsBuilder.Options);


        }

        private string GetConnectionString()
        {
            var connectionString = _configuration.GetConnectionString("MyConnection");
            return connectionString;
        }
    }
}
