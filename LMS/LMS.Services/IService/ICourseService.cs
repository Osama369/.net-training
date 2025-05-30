using LMS.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Services.IService
{
    public interface ICourseService
    {

        Task<Course> AddCourseAsync(Course crs);
        Task<Course> UpdateCourseAsync(Course crs);
        Task RemoveCourseAsync(Course crs);
        Task<Course> GetCourseByIdAsync(int id);
        Task<List<Course>> GetAllCoursesAsync();
    }
}
