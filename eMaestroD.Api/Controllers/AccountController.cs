using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Data;
using Microsoft.Data.SqlClient;
using System;
using System.Security.Claims;
using System.Security.Principal;
using Microsoft.AspNetCore.Authorization;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;
using System.Text;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.SignalR;
using eMaestroD.Api.Hub;
using eMaestroD.Api.Models;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Route("/api/[controller]/[action]")]
    public class AccountController : Controller
    {
        //private readonly UserManager<RegisterBindingModel> _userManager;
        private readonly SignInManager<RegisterBindingModel> _signInManager;
        private readonly CustomUserManager _customUserManager;

        private readonly AMDbContext _AMDbContext;
        private readonly Context _Context;
        private readonly IEmailService _emailService;
        private readonly IConfiguration _configuration;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private IWebHostEnvironment Environment;
        private readonly IHubContext<UserNotificationHub, INotificationHub> _userNotification;

        private CustomMethod cm = new CustomMethod();
        //private readonly ConnectionStringService _connectionStringService;
        public AccountController(CustomUserManager customUserManager, SignInManager<RegisterBindingModel> signInManager, AMDbContext aMDbContext, Context context, IConfiguration configuration, IHttpContextAccessor httpContextAccessor, IEmailService emailService, IWebHostEnvironment _environment, IHubContext<UserNotificationHub, INotificationHub> userNotifiation)
        {
            _AMDbContext = aMDbContext;
            _Context = context;
            //_connectionStringService = connectionStringService;
            _httpContextAccessor = httpContextAccessor;
            _configuration = configuration;
            _emailService = emailService;
            Environment = _environment;
            // _userManager = userManager;
            _signInManager = signInManager;
            _customUserManager = customUserManager;
            _userNotification = userNotifiation;
        }


        [HttpGet]
        public async Task<IActionResult> getAllTenants()
        {

            var list = _AMDbContext.Tenants.ToList();

            if (list.Count > 0)
            {
                return Ok(list);
            }

            return BadRequest();

        }

        [HttpGet]
        [Route("{emailAddress}")]
        public async Task<IActionResult> ForgetPassword(string emailAddress)
        {
            var u = await _customUserManager.FindByEmailAsync(emailAddress);
            if (u != null)
            {
                string generatedPassword = cm.GenerateStrongPassword(8);
                var code = await _customUserManager.GeneratePasswordResetTokenAsync(u);
                var result = await _customUserManager.ResetPasswordAsync(u, code, generatedPassword);
                if (result.Succeeded)
                {
                    var tenant = _AMDbContext.Tenants.Where(x => x.email.ToLower() == u.Email.ToLower()).ToList().FirstOrDefault();
                    SendResetPassword(tenant, generatedPassword);
                    return Ok();
                }
                return BadRequest(result.Errors.ToList()[0].Description);
            }
            return BadRequest("Email Address Not Correct");
        }


        [HttpPost]
        public async Task<IActionResult> saveTenant([FromBody] Tenants tenants)
        {
            if (tenants.tenantID != null && tenants.tenantID != 0)
            {
                tenants.modBy = "Admin";
                tenants.updated = DateTime.Now;
                _AMDbContext.Tenants.UpdateRange(tenants);
                await _AMDbContext.SaveChangesAsync();

                return Ok(tenants);
            }
            else
            {
                var userExist = await _customUserManager.FindByEmailAsync(tenants.email);
                if (userExist == null)
                {
                    var user = new RegisterBindingModel
                    {
                        UserName = tenants.email,
                        Email = tenants.email
                    };

                    // Create the user
                    var result = await _customUserManager.CreateAsync(user, tenants.password);

                    if (result.Succeeded)
                    {
                        tenants.password = "";
                        tenants.crtBy = tenants.firstName + " " + tenants.lastName;
                        tenants.modBy = tenants.firstName + " " + tenants.lastName;
                        tenants.created = DateTime.Now;
                        tenants.updated = DateTime.Now;
                        tenants.subscriptionType = "Trial";
                        tenants.subscriptionDate = DateTime.Now;
                        tenants.subscriptionEndDate = DateTime.Today.AddDays(90).AddHours(23).AddMinutes(59).AddSeconds(59);
                        tenants.allowExport = true;
                        tenants.isPOS = true;
                        tenants.isMultiCompany = true;
                        tenants.isMultilingual = true;
                        tenants.isMultiLocation = true;
                        tenants.isSuspended = false;
                        tenants.active = true;
                        tenants.maxCompaniesCount = 2;
                        tenants.maxUserCount = 2;
                        tenants.maxLocationCount = 2;

                        await _AMDbContext.Tenants.AddAsync(tenants);
                        await _AMDbContext.SaveChangesAsync();

                        var tenantUser = new TenantUser
                        {
                            tenantID = tenants.tenantID,
                            userID = user.Id,
                            email = tenants.email,
                            isPrimary = true, // Assuming this user is the primary user for the tenant
                            ordinal = 1, // Assuming this is the first user
                            active = true,
                            created = DateTime.Now,
                            crtBy = tenants.firstName + " " + tenants.lastName,
                            updated = DateTime.Now,
                            modBy = tenants.firstName + " " + tenants.lastName
                        };

                        await _AMDbContext.TenantUsers.AddAsync(tenantUser);
                        await _AMDbContext.SaveChangesAsync();

                        SendVerificationCode(tenants);

                        return Ok(tenants);
                    }
                    return BadRequest(result.Errors.ToList()[0].Description);
                }
                else
                {
                    tenants.password = "";
                    tenants.crtBy = tenants.firstName + " " + tenants.lastName;
                    tenants.modBy = tenants.firstName + " " + tenants.lastName;
                    tenants.created = DateTime.Now;
                    tenants.updated = DateTime.Now;
                    tenants.subscriptionType = "Trial";
                    tenants.subscriptionDate = DateTime.Now;
                    tenants.subscriptionEndDate = DateTime.Today.AddDays(90).AddHours(23).AddMinutes(59).AddSeconds(59);
                    tenants.allowExport = true;
                    tenants.isPOS = true;
                    tenants.isMultiCompany = true;
                    tenants.isMultilingual = true;
                    tenants.isMultiLocation = true;
                    tenants.isSuspended = false;
                    tenants.active = true;
                    tenants.maxCompaniesCount = 2;
                    tenants.maxUserCount = 2;
                    tenants.maxLocationCount = 2;

                    await _AMDbContext.Tenants.AddAsync(tenants);
                    await _AMDbContext.SaveChangesAsync();

                    var tenantUser = new TenantUser
                    {
                        tenantID = tenants.tenantID,
                        userID = userExist.Id,
                        email = tenants.email,
                        isPrimary = false, 
                        ordinal = 2, 
                        active = true,
                        created = DateTime.Now,
                        crtBy = tenants.firstName + " " + tenants.lastName,
                        updated = DateTime.Now,
                        modBy = tenants.firstName + " " + tenants.lastName
                    };

                    await _AMDbContext.TenantUsers.AddAsync(tenantUser);
                    await _AMDbContext.SaveChangesAsync();

                    SendVerificationCode(tenants);

                    return Ok(tenants);

                }
                return BadRequest("Something Went Wrong.");
            }
        }


        [HttpPost]
        public async Task<IActionResult> sendEmailToTenant([FromBody] List<Tenants> tenants)
        {

            var templateList = _AMDbContext.EmailTemplates.ToList();
            int i = 0;
            var companyName = _configuration.GetSection("AppSettings:companyName").Value;
            var supportEmail = _configuration.GetSection("AppSettings:supportEmail").Value;
            var appUrl = _configuration.GetSection("AppSettings:appUrl").Value;
            List<EmailMessage> em = new List<EmailMessage>();
            foreach (var item in tenants)
            {
                float days = (float)(item.subscriptionEndDate - DateTime.Now.Date).TotalDays;
                int remainingDays = (int)Math.Ceiling(days);
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

                if (template.Count > 0)
                {
                    i++;
                    template[0].Body = template[0].Body.Replace("[YourCompanyName]", companyName);
                    template[0].Body = template[0].Body.Replace("[Support Email/Phone]", supportEmail);
                    template[0].Body = template[0].Body.Replace("[appUrl]", appUrl);
                    template[0].Body = template[0].Body.Replace("[SubscriberName]", item.firstName + " " + item.lastName);
                    em.Add(new EmailMessage
                    {
                        Body = template[0].Body,
                        Subject = template[0].Subject,
                        ToEmailAddress = item.email,
                        FromEmail = "no_reply@logicalTechnologist.com",
                        Status = 1
                    });
                    _emailService.SendEmail(item.email, template[0].Subject, template[0].Body);
                }
            }
            if (em.Count > 0)
            {
                _AMDbContext.EmailMessage.AddRange(em);
                await _AMDbContext.SaveChangesAsync();
            }
            if (i > 0)
            {
                return Ok(tenants);
            }
            return BadRequest("Email not sended because tenant remaining days doesnot match with message template");
        }

        [HttpDelete]
        [Route("{tenantID}")]
        public async Task<IActionResult> deleteTenant(int tenantID)
        {
            var tenantlist = _AMDbContext.Tenants.Where(x => x.tenantID == tenantID).ToList();
            if (tenantlist.Count > 0)
            {
                var tenantUserList = _AMDbContext.TenantUsers.Where(x => x.tenantID == tenantID).ToList();
                if (tenantUserList.Count() > 0)
                {
                    int result = 0;
                    foreach (var item in tenantUserList)
                    {
                        var user = _customUserManager.FindByEmailAsync(item.email);
                        await _customUserManager.DeleteAsync(user);
                        result++;

                    }
                    if (result > 0)
                    {
                        _AMDbContext.RemoveRange(tenantlist);
                        await _AMDbContext.SaveChangesAsync();

                        string connString = _configuration.GetConnectionString("MyConnection");
                        SqlConnection sqlconn = new SqlConnection(connString);
                        string queryy = "DROP database eMD_" + tenantID;
                        SqlCommand cmd = new SqlCommand(queryy, sqlconn);
                        sqlconn.Open();
                        cmd.ExecuteNonQuery();
                        sqlconn.Close();

                        return Ok(tenantlist);
                    }
                }
            }
            return BadRequest("Something Went Wrong.");
        }


        [HttpPost]
        public async Task<IActionResult> loginUser(Tenants tenant)
        {

            var user = await _customUserManager.FindByEmailAsync(tenant.email);

            if (user != null)
            {
                Microsoft.AspNetCore.Identity.SignInResult result;
                if (tenant.password == _configuration.GetSection("AppSettings:assemblyGUID").Value)
                {
                    result = Microsoft.AspNetCore.Identity.SignInResult.Success;
                }
                else
                {
                    result = await _signInManager.CheckPasswordSignInAsync(user, tenant.password, false);
                }

                if (result.Succeeded)
                {
                    var tenantUser = _AMDbContext.TenantUsers.Where(x => x.userID == user.Id).ToList();
                    var tenantNames = new List<string>();
                    foreach (var item in tenantUser)
                    {
                        var tenantName = _AMDbContext.Tenants.Where(x => x.tenantID == item.tenantID).FirstOrDefault().tenantName;
                        tenantNames.Add(tenantName);
                    }
                    var emp = _AMDbContext.Tenants.Where(x => x.tenantID == tenantUser.FirstOrDefault(x => x.isPrimary == true).tenantID).FirstOrDefault();
                    if (emp.subscriptionEndDate < DateTime.Now)
                    {
                        if (emp.subscriptionType == "Trial")
                        {
                            return NotFound("Free Trial Has Been Expixed");
                        }
                        else
                        {
                            return NotFound("license Has Been Expixed");
                        }
                    }
                    else if (emp.isSuspended == true)
                    {
                        return NotFound("Account Has Been Suspended");
                    }
                    else if (emp.isEmailConfirmed == false)
                    {
                        SendVerificationCode(emp);
                        return Ok(new { idToken = "confirmation" });
                    }
                    //myDic.Add(emp.id, emp.connectionString);
                    var token = CreateToken(emp, tenant.email);

                    emp.lastLoginDate = DateTime.Now;
                    _AMDbContext.Tenants.Update(emp);
                    await _AMDbContext.SaveChangesAsync();


                    return Ok(new { tenantNames= tenantNames, idToken = token });

                }
                return BadRequest("Incorrect email or password");
            }
            return BadRequest("Incorrect email or password");
        }



        [HttpPost]
        public async Task<IActionResult> LoginAdminPanel(Tenants tenant)
        {

            var user = await _customUserManager.FindByEmailAsync(tenant.email);

            if (user != null)
            {
                Microsoft.AspNetCore.Identity.SignInResult result;
                if (tenant.password == _configuration.GetSection("AppSettings:assemblyGUID").Value)
                {
                    result = Microsoft.AspNetCore.Identity.SignInResult.Success;
                }
                else
                {
                    result = await _signInManager.CheckPasswordSignInAsync(user, tenant.password, false);
                }

                if (result.Succeeded)
                {

                 //   var tenantUser = _AMDbContext.TenantUsers.Where(x => x.userID == 0).FirstOrDefault();
                    var emp = _AMDbContext.Tenants.Where(x => x.tenantID == 0).ToList();
                    if (emp.Count() == 0)
                    {
                        var token = CreateTokenForAdminPanel(tenant.email);
                        return Ok(new { idToken = token });

                    }
                    else
                    {
                        return BadRequest("Incorrect email or password");
                    }
                }
                return BadRequest("Incorrect email or password");
            }
            return BadRequest("Incorrect email or password");
        }


        [HttpPost]
        public async Task<IActionResult> saveTenantPaymentDetail(PaymentDetail detail)
        {
            var tenant = _Context.Tenants.Where(x => x.email == detail.tenantEmailAddress).FirstOrDefault();

            if (tenant != null)
            {
                detail.tenantId = tenant.tenantID;


                tenant.maxCompaniesCount = detail.companiesCount;
                tenant.maxUserCount = detail.usersCount;
                tenant.maxLocationCount = detail.locationCount;

                tenant.subscriptionDate = DateTime.Now;
                if (detail.subscriptionDuration.ToLower() == "yearly")
                {
                    tenant.subscriptionEndDate = DateTime.Now.AddYears(1);
                }
                else
                {
                    tenant.subscriptionEndDate = DateTime.Now.AddDays(30);
                }
                tenant.subscriptionType = "Lincese";

                _Context.PaymentDetails.Add(detail);
                _Context.Tenants.Update(tenant);
                await _Context.SaveChangesAsync();

                return Ok("Success");
            }
            return BadRequest("Something Went Wrong.");
            return Ok(tenant);
        }

        [HttpPost]
        public async Task<IActionResult> SuspendTenant(Tenants tenant)
        {
            _AMDbContext.Tenants.Update(tenant);
            await _AMDbContext.SaveChangesAsync();

            return Ok(tenant);
        }


        [NonAction]
        public string CreateToken(Tenants tenant, string email)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Upn, cm.Encrypt(tenant.tenantID.ToString())),
                new Claim(ClaimTypes.Email, email)
                //new Claim(ClaimTypes.Upn, emp.connectionString),
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value
                ));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }


        [NonAction]
        public string CreateTokenForAdminPanel(string email)
        {
            List<Claim> claims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, email),
            };


            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(
                _configuration.GetSection("AppSettings:Token").Value
                ));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256Signature);

            var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddDays(1),
            signingCredentials: creds
            );
            var jwt = new JwtSecurityTokenHandler().WriteToken(token);

            return jwt;
        }

        [HttpPost]
        public async Task<IActionResult> confirmTenantVerification([FromBody] Tenants tenant)
        {
            var lst = await _AMDbContext.Tenants.Where(x => x.email == tenant.email && x.verificationCode == cm.Encrypt(tenant.verificationCode)).ToListAsync();
            if (lst.Count == 0)
            {
                return NotFound("Please Write Correct Code!");
            }
            else
            {
                //var user = await _customUserManager.FindByEmailAsync(tenant.email);
                //var r = _customUserManager.GenerateChangeEmailTokenAsync(user, tenant.email);

                var NewconnectionString = createDataBase(lst[0]);
                restoreDatabase("eMD_" + lst[0].tenantID, lst[0].tenantID);
                lst[0].isEmailConfirmed = true;
                lst[0].connectionString = cm.Encrypt(NewconnectionString);
                _AMDbContext.Tenants.Update(lst[0]);
                await _AMDbContext.SaveChangesAsync();
                await CreateMailAsync(lst[0].email, lst[0].firstName + " " + lst[0].lastName);
                await SendMailFromEmailMessageAsync();

            }
            return Ok(lst);
        }


        [HttpGet]
        [Route("{emailAddress}")]
        public async Task<IActionResult> VerifyEmailAddress(string emailAddress)
        {
            var u = await _customUserManager.FindByEmailAsync(emailAddress);
            if (u != null)
            {
                var user = _AMDbContext.Tenants.Where(x => x.email == emailAddress).ToList();
                if (user.Count > 0)
                {
                    return Ok("Success");
                }
            }
            return NotFound("Email Address is not registered.");
        }

        [NonAction]
        public string createDataBase(Tenants tenant)
        {
            string connString = _configuration.GetConnectionString("MyConnection");
            SqlConnection sqlconn = new SqlConnection(connString);
            string queryy = "Create database eMD_" + tenant.tenantID;
            SqlCommand cmd = new SqlCommand(queryy, sqlconn);
            sqlconn.Open();
            cmd.ExecuteNonQuery();
            sqlconn.Close();

            SqlConnectionStringBuilder conn = new SqlConnectionStringBuilder(connString)
            { InitialCatalog = "eMD_" + tenant.tenantID };
            var cnString = conn.ConnectionString;
            return cnString;
        }

        [NonAction]
        public void restoreDatabase(string dbName, int? tenID)
        {
            string sql = "EXEC RestoreDatabase @dbName,@tenantID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@dbName", Value = dbName },
                    new SqlParameter { ParameterName = "@tenantID", Value = tenID },
            };

            var lst = _AMDbContext.Database.ExecuteSqlRaw(sql, parms.ToArray());
        }

        [NonAction]
        public string SendVerificationCode(Tenants lst)
        {
            string verificationCode = GenerateVerificationCode();

            lst.verificationCode = cm.Encrypt(verificationCode);

            _AMDbContext.Tenants.Update(lst);
            _AMDbContext.SaveChanges();

            string htmlString = $@"<html>

                      <body style=""font-size:20px"">
                      <p  style=""text-align:center;font-size:24px;font-weight:bold"">eMaestro</p>
                      <div style=""margin: auto;width: 70%;background-color:#f5f5f5;"">
                      <div style=""margin-left:10px"">
                      <br>
                      <p>Dear {lst.firstName + " " + lst.lastName},</p>

                      <p style=""font-size:24px;font-weight:bold"">Verify Your Account</p>
  
                     <p>Your verification code is: <span style=""font-size:24px;font-weight:bold"">{verificationCode}</span></p>
                      <p>Thank you for signing up with eMaestro</p>
                      <p>Regards,<br>-eMaestro Team</br></p>
                        </div>
                        </div>
                      </body>
                      </html>
                     ";


            _emailService.SendEmail(lst.email, "Verification Code", htmlString);

            return "Success";
        }


        [NonAction]
        public string SendResetPassword(Tenants lst, string Password)
        {
            var templateList = _AMDbContext.EmailTemplates.ToList();
            int i = 0;
            var companyName = _configuration.GetSection("AppSettings:CompanyName").Value;
            var supportEmail = _configuration.GetSection("AppSettings:SupportEmail").Value;
            var appUrl = _configuration.GetSection("AppSettings:appUrl").Value;
            List<EmailMessage> em = new List<EmailMessage>();

            var template = new List<EmailTemplates>();
            template = templateList.Where(x => x.EmailTemplateName == "ResetPassword").ToList();

            if (template.Count > 0)
            {
                i++;
                template[0].Subject = template[0].Subject.Replace("[YourCompanyName]", companyName);
                template[0].Body = template[0].Body.Replace("[YourCompanyName]", companyName);
                template[0].Body = template[0].Body.Replace("[Support Email/Phone]", supportEmail);
                template[0].Body = template[0].Body.Replace("[appUrl]", appUrl);
                template[0].Body = template[0].Body.Replace("[SubscriberName]", lst.firstName + " " + lst.lastName);
                template[0].Body = template[0].Body.Replace("[NewPassword]", Password);
                em.Add(new EmailMessage
                {
                    Body = template[0].Body,
                    Subject = template[0].Subject,
                    ToEmailAddress = lst.email,
                    FromEmail = "no_reply@logicalTechnologist.com",
                    Status = 1
                });
                _emailService.SendEmail(lst.email, template[0].Subject, template[0].Body);

                _AMDbContext.EmailMessage.AddRange(em);
                _AMDbContext.SaveChanges();
            }
            return "Success";
        }

        [NonAction]
        private string GenerateVerificationCode()
        {
            Random rnd = new Random();
            return rnd.Next(1000, 9999).ToString();
        }

        [NonAction]
        private async Task<string> CreateMailAsync(string email, string tenantName)
        {
            try
            {

                var settingList = _AMDbContext.Settings.ToList();
                var emailList = settingList.Where(x => x.type == "email" && x.active == true).ToList();
                var welcomeEmailTemplate = settingList.Where(x => x.settingKey == "WelcomeEmail" && x.active == true && x.settingValue == "True").ToList();
                var emailVerifiedTemplate = settingList.Where(x => x.settingKey == "EmailVerified" && x.active == true && x.settingValue == "True").ToList();
                var NewTenantTemplate = settingList.Where(x => x.settingKey == "NewTenantRegister" && x.active == true && x.settingValue == "True").ToList();
                var supportEmail = _configuration.GetSection("AppSettings:SupportEmail").Value;
                var appUrl = _configuration.GetSection("AppSettings:appUrl").Value;

                if (emailVerifiedTemplate.Count > 0)
                {
                    var template = _AMDbContext.EmailTemplates.Where(x => x.EmailTemplateName == emailVerifiedTemplate[0].settingKey).ToList();
                    if (template.Count > 0)
                    {
                        template[0].Body = template[0].Body.Replace("[Support Email/Phone]", supportEmail);
                        template[0].Body = template[0].Body.Replace("[appUrl]", appUrl);
                        template[0].Body = template[0].Body.Replace("[logoPath]", appUrl + "/assets/layout/images/logo.png");

                        EmailMessage em = new EmailMessage()
                        {
                            Subject = template[0].Subject,
                            Body = template[0].Body,
                            FromEmail = "no_reply@logicalTechnologist.com",
                            ToEmailAddress = email,
                            Status = 0,
                        };
                        _AMDbContext.EmailMessage.AddAsync(em);
                    }
                }

                if (welcomeEmailTemplate.Count > 0)
                {
                    var template = _AMDbContext.EmailTemplates.Where(x => x.EmailTemplateName == welcomeEmailTemplate[0].settingKey).ToList();
                    if (template.Count > 0)
                    {
                        template[0].Body = template[0].Body.Replace("[Support Email/Phone]", supportEmail);
                        template[0].Body = template[0].Body.Replace("[appUrl]", appUrl);
                        template[0].Body = template[0].Body.Replace("[logoPath]", appUrl + "/assets/layout/images/logo.png");

                        EmailMessage em = new EmailMessage()
                        {
                            Subject = template[0].Subject,
                            Body = template[0].Body,
                            FromEmail = "no_reply@logicalTechnologist.com",
                            ToEmailAddress = email,
                            Status = 0,
                        };
                        _AMDbContext.EmailMessage.AddAsync(em);
                    }
                }

                if (NewTenantTemplate.Count > 0)
                {
                    var template = _AMDbContext.EmailTemplates.Where(x => x.EmailTemplateName == NewTenantTemplate[0].settingKey).ToList();
                    if (template.Count > 0)
                    {
                        List<EmailMessage> em = new List<EmailMessage>();

                        template[0].Body = template[0].Body.Replace("[tenantName]", tenantName);
                        template[0].Body = template[0].Body.Replace("[tenantEmail]", email);
                        foreach (var item in emailList)
                        {
                            em.Add(new EmailMessage
                            {
                                Subject = template[0].Subject,
                                Body = template[0].Body,
                                FromEmail = "no_reply@logicalTechnologist.com",
                                ToEmailAddress = item.settingValue,
                                Status = 0,
                            });
                        }
                        _AMDbContext.EmailMessage.AddRangeAsync(em);
                    }
                }
                await _AMDbContext.SaveChangesAsync();

                return "Success";
            }
            catch (Exception ex)
            {
                return "Success";
            }
        }

        [NonAction]
        private async Task<string> SendMailFromEmailMessageAsync()
        {
            using var transaction = await _AMDbContext.Database.BeginTransactionAsync();
            try
            {
                // Fetch the list of email messages with Status == 0 using raw SQL
                var sendMailList = await _AMDbContext.EmailMessage
                    .FromSqlRaw("SELECT * FROM EmailMessage WHERE Status = 0")
                    .ToListAsync();

                foreach (var item in sendMailList)
                {
                    _emailService.SendEmail(item.ToEmailAddress, item.Subject, item.Body);
                }

                // Update the status of all the processed emails to 1 using raw SQL
                var emailIds = sendMailList.Select(x => x.EmailMessageID).ToList();
                if (emailIds.Count > 0)
                {
                    var ids = string.Join(",", emailIds);
                    var updateQuery = $"UPDATE EmailMessage SET Status = 1 WHERE EmailMessageID IN ({ids})";
                    await _AMDbContext.Database.ExecuteSqlRawAsync(updateQuery);
                }

                await transaction.CommitAsync();

                return "Success";
            }
            catch (Exception ex)
            {
                await transaction.RollbackAsync();
                // Log the exception as needed
                return "Error: " + ex.Message;
            }
        }



        [NonAction]
        private string SendMail(Tenants lst, string subject, string body)
        {
            string htmlString = $@"<html>

                      <body style=""font-size:20px"">
                      <div style=""margin: auto;width: 90%;"">
                      <div style=""margin-left:20px"">
                      <br>
                      <p style=""font-weight:bold"">Dear {lst.firstName + " " + lst.lastName},</p>

                      <p>{body}</p>
  
                      <p style=""font-weight:bold"">Best Regards,<br>eMaestro Team</br></p>
                        </div>
                        </div>
                      </body>
                      </html>
                     ";


            _emailService.SendEmail(lst.email, subject, htmlString);

            return "Success";
        }


    }
}