using MyStudent.DataAccess.DbSet;
using MyStudent.DataAccess.IRepositories;
using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.DataAccess.Repositories
{
    public class StudentRepository : IStudentRepository  // implement the interface 
    {
        // using the Dbcontext instanvce 
        private readonly MyDbContext _dbcontext;

        // now will use constructor to use _dbcontext
        public StudentRepository(MyDbContext _dbContext)
        {
            this._dbcontext = _dbContext;
        }
        public async Task<Student> AddAsync(Student student)
        {
             await _dbcontext.Students.AddAsync(student);  // addasynch context me hota  ha 
            // savechanges 
            await _dbcontext.SaveChangesAsync();  // savechangesasyncc context me hota ha
            return student;
        }
        public async Task<Student> FindByIdAsync(int stuentID)
        {
            try
            {
               var res = await _dbcontext.Students.FindAsync(stuentID);
                return res;
            }catch(Exception ex)
            {
                
            }
            return new Student();
        }

        public Student FirstOrDefaultByStudentId(int stuentID)
        {
            return _dbcontext.Students.FirstOrDefault(s => s.StudentID == stuentID);
        }

        public List<Student> GetAll()
        {
            return _dbcontext.Students.ToList();
            
        }

        public async Task Remove(Student student)
        {
             _dbcontext.Students.Remove(student);
            await _dbcontext.SaveChangesAsync();
           
        }

        public async Task<Student> Update(Student student)
        {
            _dbcontext.Students.Update(student);
            await _dbcontext.SaveChangesAsync();
            return student;
        }


    }
}
