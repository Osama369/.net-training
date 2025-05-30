using LMS.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.DbSet
{
    public class MyDbContext : DbContext
    {

        public MyDbContext(DbContextOptions<MyDbContext> options) 
            
            : base(options) { }

        public DbSet<Student> Students { get; set; }

        public DbSet<Course> Course { get; set; }

        public DbSet<Class> Classes { get; set; }

        public DbSet<StudentCourse> StudentCourse { get; set; }
    }


}
