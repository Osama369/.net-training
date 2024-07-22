using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using eMaestroD.Api.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class EmailController : Controller
    {
        private readonly AMDbContext _AMDbContext;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment Environment;
        private CustomMethod cm = new CustomMethod();
        public EmailController(AMDbContext aMDbContext, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IWebHostEnvironment _environment)
        {
            _AMDbContext = aMDbContext;
            //_connectionStringService = connectionStringService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _emailService = emailService;
            Environment = _environment;
        }
        [HttpPost]
        public IActionResult SendMail()
        {
            var tenantList = _AMDbContext.Tenants.ToList();
            var templateList = _AMDbContext.EmailTemplates.ToList();
            if (tenantList.Count > 0)
            {
                var companyName = _configuration.GetSection("AppSettings:companyName").Value;
                var supportEmail = _configuration.GetSection("AppSettings:supportEmail").Value;
                var appUrl = _configuration.GetSection("AppSettings:appUrl").Value;
                List<EmailMessage> em = new List<EmailMessage>();
                foreach (var item in tenantList)
                {
                    float days = (float)(item.subscriptionEndDate - DateTime.Now.Date).TotalDays;
                    float lastLoginDays = (float)(DateTime.Now.Date - (item.lastLoginDate == null ? DateTime.Now.Date : DateTime.Parse(item.lastLoginDate.ToString()))).TotalDays;
                    int remainingDays = (int)Math.Ceiling(days);
                    int lastLoginDaysCount = (int)Math.Ceiling(lastLoginDays);
                    var template = new List<EmailTemplates>();
                    if (remainingDays == 0 && item.subscriptionType == "Trial")
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "ExpireTrial").ToList();

                    }
                    else if (remainingDays == 0 && item.subscriptionType == "License")
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "ExpireLicense").ToList();

                    }
                    else if (remainingDays == 1)
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "1DayLeft").ToList();

                    }
                    else if (remainingDays == 7)
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "7DayLeft").ToList();

                    }
                    else if (remainingDays == 15)
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "15DaysLeft").ToList();

                    }
                    else if (remainingDays == 30)
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "30DaysLeft").ToList();

                    }

                    if (lastLoginDaysCount > 5)
                    {
                        template = templateList.Where(x => x.EmailTemplateName == "User Re-engagement").ToList();
                    }

                    if (template.Count > 0)
                    {
                        foreach (var tempItem in template)
                        {
                            tempItem.Subject = tempItem.Subject.Replace("[YourCompanyName]", companyName);
                            tempItem.Body = tempItem.Body.Replace("[YourCompanyName]", companyName);
                            tempItem.Body = tempItem.Body.Replace("[Support Email/Phone]", supportEmail);
                            tempItem.Body = tempItem.Body.Replace("[appUrl]", appUrl);
                            tempItem.Body = tempItem.Body.Replace("[SubscriberName]", item.firstName + " " + item.lastName);
                            em.Add(new EmailMessage
                            {
                                Body = tempItem.Body,
                                Subject = tempItem.Subject,
                                ToEmailAddress = item.email,
                                FromEmail = "no_reply@logicalTechnologist.com",
                                Status = 1
                            });
                            _emailService.SendEmail(item.email, tempItem.Subject, tempItem.Body);
                        }

                    }
                }

                if (em.Count > 0)
                {
                    _AMDbContext.EmailMessage.AddRange(em);
                    _AMDbContext.SaveChanges();
                }

                return Ok("Success");
            }
            return NotFound("Something Went Wrong.");
        }

        [HttpPost]
        public IActionResult SavePdfAndSend()
        {
            try
            {
                var form = Request.Form;

                // Retrieve the uploaded file
                var pdfFile = form.Files.GetFile("pdf");

                if (pdfFile != null && pdfFile.Length > 0)
                {
                    var subject = form["subject"];
                    var cstID = form["cstID"];
                    if (cstID.Count > 0)
                    {
                        _AMDbContext.Customers.Where(x => x.cstID == cstID).ToList();
                    }
                    // Specify the path to save the PDF file
                    var tenantID = cm.Decrypt(HttpContext.User.FindFirst(ClaimTypes.Upn).Value);
                    var basePath = _configuration.GetSection("AppSettings:ImgPath").Value;
                    var relativePath = Path.Combine("assets", "PDF", tenantID, "report.pdf");
                    // Create the directory if it doesn't exist
                    var filePath = Path.Combine(basePath, relativePath);
                    string directoryPath = Path.GetDirectoryName(filePath);
                    if (!Directory.Exists(directoryPath))
                    {
                        Directory.CreateDirectory(directoryPath);
                    }

                    // Save the PDF file to the specified path
                    using (var fileStream = new FileStream(filePath, FileMode.Create))
                    {
                        pdfFile.CopyTo(fileStream);
                    }

                    var adminList = _AMDbContext.Users.Where(x => x.RoleID == 1).ToList();
                    if (adminList.Count > 0)
                    {
                        foreach (var item in adminList)
                        {
                            _emailService.SendEmailWithAttachment(item.Email, subject, "", filePath);
                        }
                        return Ok("Email Has Been Send successfully");
                    }
                    return NotFound("Something Went Wrong..");
                }

                return NotFound("No valid PDF file found");
            }
            catch (Exception ex)
            {
                return NotFound("Something Went Wrong..");
            }
        }
    }
}
