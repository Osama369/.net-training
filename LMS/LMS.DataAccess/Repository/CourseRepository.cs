using LMS.DataAccess.DbSet;
using LMS.DataAccess.IRepository;
using LMS.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Repository
{
    public class CourseRepository : ICourseRepository
    {
        private readonly MyDbContext _context;

        public CourseRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Course> AddAsync(Course crs)
        {
          await _context.Course.AddAsync(crs);
          await _context.SaveChangesAsync();

            return crs;

           
        }

        public async Task<Course> FindByIdAsync(int id)
        {
            return await _context.Course.FindAsync(id);
            
        }

        public async Task<List<Course>> GetAllAsync()
        {
            return await _context.Course.ToListAsync();

        }

        public async Task RemoveAsync(Course crs)
        {
            _context.Course.Remove(crs);
            await _context.SaveChangesAsync();
        }

        public async Task<Course> UpdateAsync(Course crs)
        {
            _context.Course.Update(crs);
            await _context.SaveChangesAsync();
            return crs;
        }
    }
}
