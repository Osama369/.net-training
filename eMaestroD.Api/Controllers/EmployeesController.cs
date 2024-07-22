using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using eMaestroD.Api.Data;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Route("/api/[controller]/[action]")]

    public class EmployeesController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        public EmployeesController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

    }
}
