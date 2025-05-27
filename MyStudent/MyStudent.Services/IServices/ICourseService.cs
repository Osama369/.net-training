using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Services.IServices
{
    public interface ICourseService
    {
        Task<Course> AddCourseAsync(Course crs);
        Task<Course> UpdateCourseAsync(Course crs);


        Task<Course> GetCourseByIdAsync(int id);

        Task RemoveCourseAsync(Course crs);
        Task<List<Course>> GetAllCourseAsync();
    }
}
