using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.DataAccess.IRepositories
{
    public interface ICourseRepository
    {
        Task<Course> AddAsync(Course crs);
        Task<Course> UpdateAsync(Course crs);
        Task RemoveAsync(Course crs);
        Task<Course> FindByIdAsync(int id);
        Task<List<Course>> GetAllCoursesAsync();
    }
}
