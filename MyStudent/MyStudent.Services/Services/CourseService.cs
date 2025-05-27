using MyStudent.DataAccess.IRepositories;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Services.Services
{
    public class CourseService : ICourseService
    {
        // using the Irepository instance 
        private readonly ICourseRepository _courseRepository;

        public CourseService(ICourseRepository _courseRepository)
        {
            this._courseRepository = _courseRepository;
        }
        
        public async Task<Course> AddCourseAsync(Course crs) 
        {
            return await _courseRepository.AddAsync(crs);
        }

        public async Task<List<Course>> GetAllCourseAsync()
        {
            return await _courseRepository.GetAllCoursesAsync();
        }

        public async Task<Course> GetCourseByIdAsync(int id)
        {
            return await _courseRepository.FindByIdAsync(id);
        }

        public async Task RemoveCourseAsync(Course crs)
        {
            await _courseRepository.RemoveAsync(crs);
        }

        public async Task<Course> UpdateCourseAsync(Course crs)
        {
            return await _courseRepository.AddAsync(crs);
        }
    }
}
