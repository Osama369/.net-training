
using Microsoft.EntityFrameworkCore;
using MyStudent.DataAccess.DbSet;
using MyStudent.DataAccess.IRepositories;
using MyStudent.DataAccess.Repositories;
using MyStudent.Services.IServices;
using MyStudent.Services.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddControllersWithViews();
// add Dbcontext here 

//builder.Services.AddControllersWithViews();
builder.Services.AddDbContext<MyDbContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("MyConnection"));
}
);

// add here services using DI 
builder.Services.AddScoped<IStudentRepository, StudentRepository>();

builder.Services.AddScoped<IStudentService, StudentServices>();

var app = builder.Build();


// 🔍 Check database connection at startup
bool dbConnected = true;

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<MyDbContext>();
    try
    {
        dbContext.Database.OpenConnection();  // Open connection to test it
        dbContext.Database.CloseConnection(); // Close after testing
        Console.WriteLine("✅ Database connected successfully.");
    }
    catch (Exception ex)
    {
        dbConnected = false;
        Console.WriteLine("❌ Database connection failed: " + ex.Message);
    }
}

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Home/Error");
}
app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

// 🔁 Redirect all requests to error page if DB is down
if (!dbConnected)
{
    app.MapFallbackToController("DbNotConnected", "Error"); // You create this controller & view
}
else
{
    app.MapControllerRoute(
        name: "default",
        pattern: "{controller=Home}/{action=Index}/{id?}");
}
app.Run();

