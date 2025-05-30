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
    public class StudentService : IStudentService
    {

        private readonly IStudentRepository _studentRepository;
        private readonly IClassRepository _classRepository;
        private readonly ICourseRepository _courseRepository;
        private readonly IStudentCourseRepository _studentCourseRepository;

        public StudentService(IStudentRepository studentRepository,
            IClassRepository classRepository,
            ICourseRepository courseRepository , IStudentCourseRepository studentCourseRepository)
        {
            _studentRepository = studentRepository;
            _classRepository = classRepository;
            _courseRepository = courseRepository;
            _studentCourseRepository = studentCourseRepository;
        }

        public async Task<Student> AddStudentAsync(Student student)
        {
            return await _studentRepository.AddAsync(student);
        }

        public async Task<Student> UpdateStudentAsync(Student student)
        {
            return await _studentRepository.Update(student);
        }

        public async Task RemoveStudentAsync(Student student)
        {
            await _studentRepository.Remove(student);
        }

        public async Task<Student> GetStudentByIdAsync(int studentId)
        {
            var student = await _studentRepository.FindByIdAsync(studentId);
            if (student != null)
            {
                student.Classes = student.ClassID.HasValue
                    ? await _classRepository.FindByIdAsync(student.ClassID.Value)
                    : null;

                if (student.SelectedCourseIds != null)
                {
                    student.Course = new List<Course>();
                    foreach (var courseId in student.SelectedCourseIds)
                    {
                        var course = await _courseRepository.FindByIdAsync(courseId);
                        if (course != null)
                            student.Course.Add(course);
                    }
                }
            }
            return student;
        }

        public Student GetStudentByIdOrName(int studentId)
        {
            return _studentRepository.FirstOrDefaultByStudentId(studentId);
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            var students = await _studentRepository.GetAllAsync(); // student table 
            var classes = await _classRepository.GetAllAsync();   // class table 
            var courses = await _courseRepository.GetAllAsync();  // courses table 

            foreach (var student in students)
            {
                student.Classes = classes.FirstOrDefault(c => c.ClassID == student.ClassID);
                student.SelectedCourseIds = await _studentCourseRepository.GetCourseIdsForStudentAsync(student.StudentID);

                if (student.SelectedCourseIds != null && student.SelectedCourseIds.Any())   // count> 0
                {
                    student.Course = courses
                        .Where(course => student.SelectedCourseIds.Contains(course.CourseID))
                        .ToList();
                }
                else
                {
                    student.Course = new List<Course>();
                }
            }
            return students;
        }

        public async Task<List<int>> GetCourseIdsForStudentAsync(int studentId)
        {
           return await _studentCourseRepository.GetCourseIdsForStudentAsync(studentId);
        }

        public async Task AddStudentCourseAsync(int studentId, int courseId)
        {
            await  _studentCourseRepository.AddStudentCourseAsync(studentId, courseId);
        }

        public async Task UpdateStudentCoursesAsync(int studentId, List<int> selectedCourseIds)
        {
            await _studentCourseRepository.UpdateStudentCoursesAsync(studentId, selectedCourseIds);
        }
    }
}
