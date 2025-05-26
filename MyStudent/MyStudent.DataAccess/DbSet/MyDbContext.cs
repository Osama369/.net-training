using Microsoft.EntityFrameworkCore;
using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.DataAccess.DbSet
{
    public class MyDbContext  : DbContext
    {
        // we will use constructor for MyDbContext

      public MyDbContext (DbContextOptions<MyDbContext> options)
            : base(options) { }
     public DbSet<Student> Students { get; set; }

        public DbSet<Course> Courses { get; set; }


        public DbSet<Class> Classes { get; set; }

    }

    // tables name here 

}
