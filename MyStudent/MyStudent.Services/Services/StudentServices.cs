using MyStudent.DataAccess.IRepositories;
using MyStudent.DataAccess.Repositories;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Services.Services
{
    public class StudentServices : IStudentService
    {
        // fields of interfaces 
        private readonly IStudentRepository _studentRepositoty;
        private readonly IClassRepository _classRepositoty;
        private readonly ICourseRepository _courseRepository;
        
        public StudentServices(IStudentRepository _studentRepository, IClassRepository _classRepositoty , ICourseRepository _courseRepository)
        {
            this._studentRepositoty = _studentRepository;
            this._classRepositoty = _classRepositoty;
            this._courseRepository= _courseRepository;
        }
        public async Task<Student> AddStudentAsync(Student student)
        {
            return await _studentRepositoty.AddAsync(student);
           
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            var std = await _studentRepositoty.GetAllAsync();
            var cls = await _classRepositoty.GetAllClassesAsync();
            var crs = await _courseRepository.GetAllCoursesAsync();

            foreach (var student in std)
            {
                student.Classes = cls.FirstOrDefault(c => c.ClassID == student.ClassID);
                student.Courses = crs.FirstOrDefault(r => r.CourseID == student.CourseID);
              
            }
            
            return std;

        }

        public async Task<Student> GetStudentByIdAsync(int studentId)
        {
            var student = await _studentRepositoty.FindByIdAsync(studentId);

            if (student != null)
            {
                // Use the foreign key IDs (ClassID and CourseID), not navigation properties
                if (student.ClassID.HasValue)
                    student.Classes = await _classRepositoty.FindByIdAsync(student.ClassID.Value);
                else
                    student.Classes = null;

                if (student.CourseID.HasValue)
                    student.Courses = await _courseRepository.FindByIdAsync(student.CourseID.Value);
                else
                    student.Courses = null;
            }

            return student;
        }



        public Student GetStudentByIdOrName(int studentId)
        {

            return _studentRepositoty.FirstOrDefaultByStudentId(studentId);
        }

        public async Task RemoveStudentAsync(Student student)
        {
            await _studentRepositoty.Remove(student);
        }

        public async Task<Student> UpdateStudentAsync(Student student)
        {
            return await _studentRepositoty.Update(student);

           
        }
    }
}
