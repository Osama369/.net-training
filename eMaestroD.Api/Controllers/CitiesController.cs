using eMaestroD.Api.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.DataAccess.DataSet;

namespace eMaestroD.Api.Controllers
{

    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class CitiesController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public CitiesController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }
    }
}
