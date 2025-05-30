using LMS.DataAccess.IRepository;
using LMS.Models.Models;
using LMS.Services.IService;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Services.Service
{
    public class CourseService : ICourseService
    {
        private readonly ICourseRepository _courseRepository;

       public CourseService(ICourseRepository courseRepository)
        {
            _courseRepository = courseRepository;
        }

        public async Task<Course> AddCourseAsync(Course crs)
        {
            return await _courseRepository.AddAsync(crs);
        }

        public async Task<List<Course>> GetAllCoursesAsync()
        {
            return await _courseRepository.GetAllAsync();
        }

        public async Task<Course> GetCourseByIdAsync(int id)
        {
            return await _courseRepository.FindByIdAsync(id);
        }


        public async Task RemoveCourseAsync(Course crs)
        {
            await _courseRepository.RemoveAsync(crs);;

        }

        public async Task<Course> UpdateCourseAsync(Course crs)
        {
            return await _courseRepository.UpdateAsync(crs);
        }
    }
}
