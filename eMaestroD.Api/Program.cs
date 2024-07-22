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
using eMaestroD.Api.Hub;
using eMaestroD.Api.Models;
using eMaestroD.Api.Data;
using eMaestroD.Api.Common;

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

builder.Services.AddScoped<GLService>(); 
builder.Services.AddScoped<NotificationInterceptor>();

builder.Services.AddSingleton<ConnectionStringsDictionary>();
builder.Services.AddSingleton<CustomDbContextFactory>();
builder.Services.AddScoped(provider => provider.GetRequiredService<CustomDbContextFactory>().CreateDbContext());


// Setup identity
builder.Services.AddIdentityCore<RegisterBindingModel>()
            .AddRoles<IdentityRole>()
            .AddUserManager<CustomUserManager>()
             .AddSignInManager<SignInManager<RegisterBindingModel>>()
            .AddEntityFrameworkStores<Context>()
            .AddDefaultTokenProviders();

builder.Services.AddScoped<CustomUserManager>();


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
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseWebSockets();
app.UseCors(policy => policy.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
app.UseHttpsRedirection();
app.UseStaticFiles();
app.UseSession();
app.UseAuthentication();
app.UseAuthorization();
app.UseMvc();
app.MapHub<UserNotificationHub>("/api/Notify");
app.MapControllers();
app.Run();
