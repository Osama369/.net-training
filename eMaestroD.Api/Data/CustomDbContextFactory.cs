using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Mvc;
using System.Data.SqlClient;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.Extensions.Configuration;
using eMaestroD.Models.Models;
using eMaestroD.Api.Common;
using eMaestroD.DataAccess.DataSet;

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
                var tenant = _ConnectionStringsDictionary.GetItem(int.Parse(cm.Decrypt(tenantsID)));
                if (tenant != null)
                {
                    optionsBuilder.UseSqlServer(cm.Decrypt(tenant.connectionString));
                }
                else
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
                            _ConnectionStringsDictionary.AddItem(new Item { Id = conString[0].tenantID, connectionString = conString[0].connectionString });
                            return new AMDbContext(optionsBuilder1.Options);
                        }
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
