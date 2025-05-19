using Microsoft.EntityFrameworkCore;
using Studentproject.Models;

namespace Studentproject.Data
{
    public class MyAppContext : DbContext
    {
        public MyAppContext(DbContextOptions<MyAppContext>options) 
            : base(options) { }

        public DbSet<Student> students { get; set; } // dbset is instance of db context
        public DbSet<Course> courses { get; set; }

        public DbSet<Enrollment> enrollment { get; set; }


    }
}
