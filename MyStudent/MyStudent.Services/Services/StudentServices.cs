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
        
        public StudentServices(IStudentRepository _studentRepository)
        {
            this._studentRepositoty = _studentRepository;
        }
        public async Task<Student> AddStudentAsync(Student student)
        {
            return await _studentRepositoty.AddAsync(student);
           
        }

        public async Task<List<Student>> GetAllStudentsAsync()
        {
            return await Task.FromResult(_studentRepositoty.GetAll());

        }

        public async Task<Student> GetStudentByIdAsync(int studentId)
        {
          return  await _studentRepositoty.FindByIdAsync(studentId);
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
