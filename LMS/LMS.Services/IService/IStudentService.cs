using LMS.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Services.IService
{
    public interface IStudentService
    {
        Task<Student> AddStudentAsync(Student student);
        Task<Student> UpdateStudentAsync(Student student);
        Task RemoveStudentAsync(Student student);
        Task<Student> GetStudentByIdAsync(int studentId);
        Student GetStudentByIdOrName(int studentId);
        Task<List<Student>> GetAllStudentsAsync();
        // New methods for course handling
        Task<List<int>> GetCourseIdsForStudentAsync(int studentId);
        Task AddStudentCourseAsync(int studentId, int courseId);
        Task UpdateStudentCoursesAsync(int studentId, List<int> selectedCourseIds);
    }
}
