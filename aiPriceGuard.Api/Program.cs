using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Serialization;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Swashbuckle.AspNetCore.Filters;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using aiPriceGuard.Models.Models;
using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Api.Common;
using aiPriceGuard.Api.Data;
using aiPriceGuard.Api.Hub;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.DataAccess.Repositories;
using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.Api.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddMvc(options => options.EnableEndpointRouting = false);


builder.Services.AddDbContext<Context>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection"));
    options.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTracking);
});

builder.Services.AddSingleton<EmailService>(); 
builder.Services.AddScoped<IEmailService, EmailService>();
builder.Services.AddScoped<PdfProcessingService>();
builder.Services.AddScoped<AMDbContext>();
builder.Services.AddScoped<ISupplierRepository, SupplierRepository>();
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<IFileUploadRepository, FileUploadRepository>();
builder.Services.AddScoped<ICompanySupplierRepository, CompanySupplierRepository>();
builder.Services.AddScoped<IProductBarCodeRepository, ProductBarCodeRepository>();
builder.Services.AddScoped<ISupplierProductRepository, SupplierProductRepository>();
builder.Services.AddScoped<ISupplierFileRepository, SupplierFileRepository>();
builder.Services.AddScoped<ISharedService, SharedService>();
builder.Services.AddScoped<ISupplierService, SupplierService>();
builder.Services.AddScoped<IProductService, ProductService>();
builder.Services.AddScoped<IFileUploadService, FileUploadService>();
builder.Services.AddScoped<IinvoiceService, InvoiceService>();
builder.Services.AddScoped<IinvoiceRepository, InvoiceRepository>();
builder.Services.AddScoped<IinvoiceDetailRepository, InvoiceDetailRepository>();

builder.Services.AddHttpContextAccessor();

builder.Services.AddSingleton<ConnectionStringsDictionary>();
builder.Services.AddSingleton<CustomDbContextFactory>();
builder.Services.AddScoped(provider => provider.GetRequiredService<CustomDbContextFactory>().CreateDbContext());
builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.PropertyNamingPolicy = null; // Use PascalCase
});

// Setup identity
builder.Services.AddIdentityCore<IdentityUser>()
            .AddRoles<IdentityRole>()
            .AddUserManager<UserManager<IdentityUser>>()
             .AddSignInManager<SignInManager<IdentityUser>>()
            .AddEntityFrameworkStores<Context>()
            .AddDefaultTokenProviders();



//builder.Services.AddIdentityCore<RegisterBindingModel>().AddEntityFrameworkStores<AMDbContext>();



builder.Services.AddMvc().AddNewtonsoftJson(options =>
{
    options.SerializerSettings.ContractResolver = new DefaultContractResolver();
});

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        Description = "Standard Authorization header using bearer scheme",
        In = ParameterLocation.Header,
        Name= "Authorization",
        Type = SecuritySchemeType.ApiKey
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});



//Dictionary<int, string> myDic = new Dictionary<int, string>();

// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle


builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new Microsoft.IdentityModel.Tokens.TokenValidationParameters
        {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.
                GetBytes(builder.Configuration.GetSection("AppSettings:Token").Value)),
            ValidateIssuer = false,
            ValidateAudience = false
        };
    });


builder.Services.AddSignalR();
builder.Services.AddHttpContextAccessor();
builder.Services.AddDistributedMemoryCache();
builder.Services.AddHttpClient();
builder.Services.AddSession(options =>
{
    options.IdleTimeout = TimeSpan.FromMinutes(30);//We set Time here 
});


var app = builder.Build();

// Configure the HTTP request pipeline.
//if (app.Environment.IsDevelopment())
//{
    
//}
app.UseSwagger();
app.UseSwaggerUI();

app.UseWebSockets();
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.UseMvc();
app.MapControllers();
app.Run();
