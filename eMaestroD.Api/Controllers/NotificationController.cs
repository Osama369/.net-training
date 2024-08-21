using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[action]")]
    public class NotificationController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        string username = "";
        public NotificationController(AMDbContext aMDbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor)
        {
            _AMDbContext = aMDbContext;
            _configuration = configuration;
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
        public async Task<IActionResult> GetNotificationAlert(int comID)
        {
            var list = await _AMDbContext.NotificaitonAlert
            .Where(x => x.comID == comID)
            .Join(
                _AMDbContext.Screens,
                notification => notification.screenID,
                screen => screen.screenID,
                (notification, screen) => new { Notification = notification, Screen = screen }
            )
            .Join(
                _AMDbContext.Roles,
                result => result.Notification.roleID,
                role => role.RoleID,
                (result, role) => new { result.Notification, result.Screen, Role = role }
            )
            .Select(result => new NotificationAlert
            {
                notificationAlertID = result.Notification.notificationAlertID,
                screenID = result.Notification.screenID,
                screenName = result.Screen.screenName,
                roleID = result.Notification.roleID,
                roleName = result.Role.RoleName,
                onSave = result.Notification.onSave,
                onEdit = result.Notification.onEdit,
                onDelete = result.Notification.onDelete,
                active = result.Notification.active,
                createdBy = result.Notification.createdBy,
                createdDate = result.Notification.createdDate,
                modifiedBy = result.Notification.modifiedBy,
                modifiedDate = result.Notification.modifiedDate,
            })
            .ToListAsync();
            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> SaveNotificationAlert(NotificationAlert notificationAlertList)
        {
            var list = _AMDbContext.NotificaitonAlert.ToList();
            if (notificationAlertList.notificationAlertID != 0)
            {
                if (list.Where(x => x.notificationAlertID != notificationAlertList.notificationAlertID && x.comID == notificationAlertList.comID && x.screenID == notificationAlertList.screenID && x.roleID == notificationAlertList.roleID).ToList().Count > 0)
                {
                    return NotFound("Notification Alert Already Exist.");
                }
                else
                {
                    notificationAlertList.modifiedDate = DateTime.Now;
                    notificationAlertList.modifiedBy = username;
                    _AMDbContext.NotificaitonAlert.Update(notificationAlertList);
                    await _AMDbContext.SaveChangesAsync();
                }
            }
            else
            {
                if (list.Where(x => x.comID == notificationAlertList.comID && x.screenID == notificationAlertList.screenID && x.roleID == notificationAlertList.roleID).ToList().Count > 0)
                {
                    return NotFound("Notification Alert Already Exist.");
                }
                else
                {
                    notificationAlertList.createdDate = notificationAlertList.modifiedDate = DateTime.Now;
                    notificationAlertList.modifiedBy = notificationAlertList.createdBy = username;
                    await _AMDbContext.NotificaitonAlert.AddAsync(notificationAlertList);
                    await _AMDbContext.SaveChangesAsync();
                }
            }
            return Ok(notificationAlertList);
        }

        [HttpDelete]
        [Route("{notificationAlertID}")]
        public async Task<IActionResult> DeleteNotificationAlert(int notificationAlertID)
        {
            _AMDbContext.RemoveRange(_AMDbContext.NotificaitonAlert.Where(a => a.notificationAlertID == notificationAlertID));
            await _AMDbContext.SaveChangesAsync();
            return Ok();
        }

        [HttpGet]
        [Route("{comID}")]
        public async Task<IActionResult> GetNotification(int comID)
        {
            var list = _AMDbContext.NotificationMessage
           .Where(x => x.comID == comID)
           .Join(
               _AMDbContext.Users,
               notification => notification.userID,
               user => user.UserID,
               (notification, user) => new
               {
                   notification.notificationMessageID,
                   notification.comID,
                   notification.userID,
                   notification.message,
                   notification.active,
                   notification.createdBy,
                   notification.createdDate,
                   notification.modifiedBy,
                   notification.modifiedDate,
                   username = user.FirstName + " " + user.LastName,
                   email = user.Email,
                   notification.voucherNo,
               }
           )
           .ToList();

            return Ok(list.OrderByDescending(x => x.createdDate));
        }


        [HttpPost]
        public async Task<IActionResult> UpdateNotificationStatus(List<NotificationMessage> notificationMessage)
        {

            foreach (var item in notificationMessage)
            {
                item.active = false;
                _AMDbContext.Update(item);
            }

            await _AMDbContext.SaveChangesAsync();

            return Ok(notificationMessage);
        }

    }
}
