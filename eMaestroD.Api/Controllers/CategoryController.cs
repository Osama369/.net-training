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
    public class CategoryController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public CategoryController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        [HttpGet("GetAllWithComID")]
        public async Task<ActionResult<IEnumerable<Category>>> GetAllCategories(int comID)
        {
            var categories = await _AMDbContext.Categories
              .Where(c => c.comID == comID)
              .Select(c => new Category
              {
                  categoryID = c.categoryID,
                  parentCategoryID = c.parentCategoryID,
                  parentCategoryName = _AMDbContext.Categories
                                          .Where(pc => pc.categoryID == c.parentCategoryID)
                                        .Select(pc => pc.categoryName)
                                        .FirstOrDefault(),
                depID = c.depID,
                depName = _AMDbContext.Departments
                                    .Where(d => d.depID == c.depID)
                                    .Select(d => d.depName)
                                    .FirstOrDefault(),
                comID = c.comID,
                categoryName = c.categoryName,
                descr = c.descr,
                active = c.active,
                crtBy = c.crtBy,
                crtDate = c.crtDate,
                modby = c.modby,
                modDate = c.modDate
            })
            .ToListAsync();

            var response = new ResponsedGroupListVM
            {
                enttityDataSource = categories,
                entityModel = categories?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        [HttpGet("GetByDepIDAndComID")]
        public async Task<ActionResult<Category>> GetCategory(int depID, int comID)
        {
            var category = await _AMDbContext.Categories
                .Where(c => c.depID == depID && c.comID == comID).ToListAsync();

            var response = new ResponsedGroupListVM
            {
                enttityDataSource = category,
                entityModel = category?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        [HttpPost]
        public async Task<ActionResult<Category>> UpsertCategory(Category model)
        {
            // Check if category already exists
            var existingCategory = await _AMDbContext.Categories.FindAsync(model.categoryID);

            if (existingCategory == null)
            {
                // If category doesn't exist, add it
                model.crtDate = DateTime.Now;
                _AMDbContext.Categories.Add(model);
            }
            else
            {
                // If category exists, update it
                existingCategory.parentCategoryID = model.parentCategoryID;
                existingCategory.parentCategoryName = model.parentCategoryName;
                existingCategory.depID = model.depID;
                existingCategory.comID = model.comID;
                existingCategory.categoryName = model.categoryName;
                existingCategory.descr = model.descr;
                existingCategory.active = model.active;
                existingCategory.modby = model.modby;
                existingCategory.modDate = DateTime.Now;

                _AMDbContext.Entry(existingCategory).State = EntityState.Modified;
                model = existingCategory; // Update the model to reflect changes
            }

            try
            {
                await _AMDbContext.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return CreatedAtAction(nameof(GetCategory), new { id = model.categoryID }, model);
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteCategory(int id)
        {
            var category = await _AMDbContext.Categories.FindAsync(id);
            if (category == null)
            {
                return NotFound();
            }

            var existlist = await _AMDbContext.Categories.Where(x => x.parentCategoryID == id).ToListAsync();
            if (existlist.Any())
            {
                return NotFound("Some Child Categories Depend on this Category. Please Delete Child Categories First");
            }

            _AMDbContext.Categories.Remove(category);
            await _AMDbContext.SaveChangesAsync();

            return NoContent();
        }
    }
}
