using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ProductGroupsController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly NotificationInterceptor _notificationInterceptor;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public ProductGroupsController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            username = GetUsername();
        }

        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }


        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetAllGroups(int comID)
        {
            var grp = await _AMDbContext.ProdGroups.ToListAsync();
            var groups = grp.FindAll(x => x.active == true && x.comID == comID).ToList();
            ResponsedGroupListVM vM = new ResponsedGroupListVM();
            vM.enttityDataSource = groups;
            vM.entityModel = groups?.GetEntity_MetaData();
            return Ok(vM);
        }

        [HttpPost]
        public async Task<IActionResult> AddProductGroup([FromBody] ProdGroups product)
        {
            var comID = int.Parse(Request.Headers["comID"].ToString());

            product.prodGrpName = product.prodGrpName.Trim();
            if (product.prodGrpID != 0)
            {
                var existList = _AMDbContext.ProdGroups.Where(x => x.prodGrpID != product.prodGrpID && x.prodGrpName.ToLower() == product.prodGrpName.ToLower() && x.comID == comID).ToList();
                if (existList.Count() == 0)
                {
                    product.comID = comID;
                    product.modby = username;
                    product.modDate = DateTime.Now;

                    _AMDbContext.ProdGroups.Update(product);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("ProductCategoryEdit", comID, "");
                }
                else
                {
                    return NotFound("Category Name Already Exists!");
                }
                return Ok(product);
            }
            else
            {

                product.active = true;
                product.parentProdGrpID = 0;
                product.prodGrpTypeID = 1;
                product.comID = comID;
                product.crtBy = username;
                product.crtDate = DateTime.Now;
                product.modby = username;
                product.modDate = DateTime.Now;

                var existList = _AMDbContext.ProdGroups.Where(x => x.prodGrpName.ToLower() == product.prodGrpName.ToLower() && x.comID == comID).ToList();
                if (existList.Count() == 0)
                {
                    await _AMDbContext.ProdGroups.AddAsync(product);
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("ProductCategoryCreate", comID, "");
                }
                else
                {
                    return NotFound("Category Name Already Exists!");
                }
                return Ok(product);
            }
        }

        [HttpDelete]
        [Route("{groupID}")]
        public async Task<IActionResult> DeleteGroup(int groupID)
        {
            var prdList = _AMDbContext.Products.Where(x => x.prodGrpID == groupID).ToList();
            if (prdList.Count() == 0)
            {
                _AMDbContext.RemoveRange(_AMDbContext.ProdGroups.Where(a => a.prodGrpID == groupID));
                _AMDbContext.SaveChanges();
                var comID = Request.Headers["comID"].ToString();
                _notificationInterceptor.SaveNotification("ProductCategoryDelete", int.Parse(comID), "");
                return Ok();
            }
            else
            {
                return NotFound("This Categroy related to " + prdList.Count + " Product, First Delete the Product then Categroy.");
            }

        }


    }
}
