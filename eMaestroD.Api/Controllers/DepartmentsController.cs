using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class DepartmentsController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public DepartmentsController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        [HttpGet("GetAllDepartments/{comID}")]
        public async Task<ActionResult> GetAllDepartments(int comID)
        {
            var departments = await _AMDbContext.Departments.Where(x => x.comID == comID).ToListAsync();
            var response = new ResponsedGroupListVM
            {
                enttityDataSource = departments,
                entityModel = departments?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(int id)
        {
            var department = await _AMDbContext.Departments.FindAsync(id);

            if (department == null)
            {
                return NotFound();
            }

            return Ok(department);
        }

        [HttpPost]
        public async Task<ActionResult<Department>> UpsertDepartment(Department model)
        {
            var existingDepartment = await _AMDbContext.Departments.FindAsync(model.depID);

            bool nameExists = await _AMDbContext.Departments
                .AnyAsync(d => d.depName == model.depName && d.depID != model.depID && d.comID == model.comID);

            if (nameExists)
            {
                return BadRequest($"A department with the name '{model.depName}' already exists.");
            }

            if (existingDepartment == null)
            {
                model.crtDate = DateTime.Now;
                _AMDbContext.Departments.Add(model);
            }
            else
            {
                existingDepartment.depName = model.depName;
                existingDepartment.descr = model.descr;
                existingDepartment.active = model.active;
                existingDepartment.modby = model.modby;
                existingDepartment.modDate = DateTime.Now;
                existingDepartment.comID = model.comID;

                _AMDbContext.Entry(existingDepartment).State = EntityState.Modified;
            }

            try
            {
                await _AMDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetDepartment), new { id = model.depID }, model);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _AMDbContext.Departments.FindAsync(id);
            if (department == null)
            {
                return NotFound();
            }

            var existlist = await _AMDbContext.Categories.Where(x => x.depID == id).ToListAsync();
            if (existlist.Any())
            {
                return NotFound("Some Categories Depend on this Department. Please Delete Categories First");
            }

            _AMDbContext.Departments.Remove(department);
            await _AMDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
