using System.Data.Common;
using System.Threading;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore.Diagnostics;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using System;
using System.Collections;
using Microsoft.AspNetCore.SignalR;
using eMaestroD.Api.Hub;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;

namespace eMaestroD.Api.Common
{
    public class NotificationInterceptor
    {
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly IConfiguration _configuration;
        private readonly AMDbContext _AMDbContext;

        private readonly IHubContext<UserNotificationHub, INotificationHub> _userNotification;
        public NotificationInterceptor(IHttpContextAccessor httpContextAccessor, IConfiguration configuration, AMDbContext aMDbContext, IHubContext<UserNotificationHub, INotificationHub> userNotifiation)
        {
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _AMDbContext = aMDbContext;
            _userNotification = userNotifiation;
        }

        public void SaveNotification(string screenName, int? comID, string voucherNo)
        {
            var headers = _httpContextAccessor.HttpContext?.Request.Headers;
            if (headers != null)
            {
                var userEmail = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
                var user = _AMDbContext.Users.Where(x => x.Email == userEmail).ToList();
                if (user.Count > 0)
                {
                    if (screenName.Contains("Create"))
                    {
                        screenName = screenName.Split("Create")[0];
                        var screen = _AMDbContext.Screens.Where(x => x.path.ToLower() == screenName.ToLower()).ToList();
                        if (screen.Count > 0)
                        {
                            var alertlist = _AMDbContext.NotificaitonAlert.Where(x => x.roleID == user[0].RoleID && x.screenID == screen[0].screenID && x.comID == comID && x.onSave == true && x.active == true).ToList();
                            if (alertlist.Count > 0)
                            {

                                NotificationMessage notificationMessage = new NotificationMessage()
                                {
                                    active = true,
                                    comID = comID,
                                    userID = user[0].UserID,
                                    message = "New entry has been added in " + screen[0].screenName,
                                    createdDate = DateTime.Now,
                                    modifiedDate = DateTime.Now,
                                    createdBy = userEmail,
                                    modifiedBy = userEmail,
                                    voucherNo = voucherNo

                                };

                                _AMDbContext.NotificationMessage.AddAsync(notificationMessage);
                                _AMDbContext.SaveChangesAsync();

                                _userNotification.Clients.All.SendMessage(new Notification
                                {
                                    comID = comID,
                                    active = true,
                                    email = userEmail,
                                    username = user[0].FirstName + " " + user[0].LastName,
                                    message = "New entry has been added in " + screen[0].screenName,
                                    createdDate = DateTime.Now,
                                    tenantID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Upn),
                                    voucherNo = voucherNo
                                });
                            }
                        }
                    }
                    else if (screenName.Contains("Edit"))
                    {
                        screenName = screenName.Split("Edit")[0];
                        var screen = _AMDbContext.Screens.Where(x => x.path.ToLower() == screenName.ToLower()).ToList();
                        if (screen.Count > 0)
                        {
                            var alertlist = _AMDbContext.NotificaitonAlert.Where(x => x.roleID == user[0].RoleID && x.screenID == screen[0].screenID && x.comID == comID && x.onEdit == true && x.active == true).ToList();
                            if (alertlist.Count > 0)
                            {
                                NotificationMessage notificationMessage = new NotificationMessage()
                                {
                                    active = true,
                                    comID = comID,
                                    userID = user[0].UserID,
                                    message = "Entry has been updated in " + screen[0].screenName,
                                    createdDate = DateTime.Now,
                                    modifiedDate = DateTime.Now,
                                    createdBy = userEmail,
                                    modifiedBy = userEmail,
                                    voucherNo = voucherNo

                                };

                                _AMDbContext.NotificationMessage.AddAsync(notificationMessage);
                                _AMDbContext.SaveChangesAsync();

                                _userNotification.Clients.All.SendMessage(new Notification
                                {
                                    comID = comID,
                                    active = true,
                                    email = userEmail,
                                    username = user[0].FirstName + " " + user[0].LastName,
                                    message = "Entry has been updated in " + screen[0].screenName,
                                    createdDate = DateTime.Now,
                                    tenantID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Upn),
                                    voucherNo = voucherNo
                                });
                            }
                        }
                    }
                    else if (screenName.Contains("Delete"))
                    {
                        screenName = screenName.Split("Delete")[0];
                        var screen = _AMDbContext.Screens.Where(x => x.path.ToLower() == screenName.ToLower()).ToList();
                        if (screen.Count > 0)
                        {
                            var alertlist = _AMDbContext.NotificaitonAlert.Where(x => x.roleID == user[0].RoleID && x.screenID == screen[0].screenID && x.comID == comID && x.onDelete == true && x.active == true).ToList();
                            if (alertlist.Count > 0)
                            {
                                if (voucherNo != "")
                                {
                                    voucherNo = ", Invoice No : " + voucherNo;
                                }
                                NotificationMessage notificationMessage = new NotificationMessage()
                                {
                                    active = true,
                                    comID = comID,
                                    userID = user[0].UserID,
                                    message = "Entry has been deleted in " + screen[0].screenName + voucherNo,
                                    createdDate = DateTime.Now,
                                    modifiedDate = DateTime.Now,
                                    createdBy = userEmail,
                                    modifiedBy = userEmail,
                                    voucherNo = ""
                                };

                                _AMDbContext.NotificationMessage.AddAsync(notificationMessage);
                                _AMDbContext.SaveChangesAsync();

                                _userNotification.Clients.All.SendMessage(new Notification
                                {
                                    comID = comID,
                                    active = true,
                                    email = userEmail,
                                    username = user[0].FirstName + " " + user[0].LastName,
                                    message = "Entry has been deleted in " + screen[0].screenName + voucherNo,
                                    createdDate = DateTime.Now,
                                    tenantID = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Upn),
                                    voucherNo = ""
                                });
                            }
                        }
                    }
                }

            }
        }

    }
}


