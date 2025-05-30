using LMS.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.IRepository
{
    public interface IStudentRepository
    {
        Task<Student> AddAsync(Student student);
        Task<Student> Update(Student student);
        Task Remove(Student student);
        Task<Student> FindByIdAsync(int studentID);
        Student FirstOrDefaultByStudentId(int studentID);
        Task<List<Student>> GetAllAsync();
    }
}
