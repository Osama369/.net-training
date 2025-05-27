using Microsoft.EntityFrameworkCore;
using MyStudent.DataAccess.DbSet;
using MyStudent.DataAccess.IRepositories;
using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.DataAccess.Repositories
{
    public class CourseRepository : ICourseRepository
    {
        // using the dbcontext here 
        private readonly MyDbContext _dbcontext;

        public CourseRepository(MyDbContext _dbcontext)
        {
            this._dbcontext = _dbcontext;    
        }

        public async Task<Course> AddAsync(Course crs)
        {
           await _dbcontext.Courses.AddAsync(crs);
            await _dbcontext.SaveChangesAsync();
            return crs;
        }

        public async Task<Course> FindByIdAsync(int id)
        {
            try
            {
               var res = await _dbcontext.Courses.FindAsync(id);
                return res; 
            }
            catch (Exception ex)
            {
                return new Course();
            }
        }

        public async Task<List<Course>> GetAllCoursesAsync()
        {
            return await _dbcontext.Courses.ToListAsync();
        }

        public async Task RemoveAsync(Course crs)
        {
           _dbcontext.Courses.Remove(crs);
             await _dbcontext.SaveChangesAsync();
        }

        public async Task<Course> UpdateAsync(Course crs)
        {
           _dbcontext.Courses.Update(crs);
           await _dbcontext.SaveChangesAsync();
            return crs;
        }
    }
}
