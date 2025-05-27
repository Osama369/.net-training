using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.DataAccess.IRepositories
{
    public interface IStudentRepository

    {

        Task<Student> AddAsync(Student student);
       // Task<Student> GetByIdAsync(int studentID);
        Student FirstOrDefaultByStudentId(int studentID); // id or name 
         
        Task Remove(Student student);
        Task<Student> Update(Student student); // return student 
        Task<Student> FindByIdAsync(int studentID);
        Task<List<Student>> GetAllAsync();  // getall students toList krke denge 
    }
}
