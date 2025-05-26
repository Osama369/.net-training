using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Services.IServices
{
    public interface IStudentService
    {
        Task<Student> AddStudentAsync(Student student);

        Task<Student> UpdateStudentAsync(Student student);

        Task RemoveStudentAsync(Student student);

        // Get single student
        Task<Student> GetStudentByIdAsync(int studentId);

        Student GetStudentByIdOrName(int studentId);  // based on your repo naming

        // Get all students
        Task<List<Student>> GetAllStudentsAsync();

    }
}
