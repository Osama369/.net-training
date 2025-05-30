using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.IRepository
{
    public interface IStudentCourseRepository
    {
        Task<List<int>> GetCourseIdsForStudentAsync(int studentId);
        Task AddStudentCourseAsync(int studentId, int courseId);
        Task UpdateStudentCoursesAsync(int studentId, List<int> selectedCourseIds);
    }
}
