using LMS.DataAccess.DbSet;
using LMS.DataAccess.IRepository;
using LMS.Models.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.Repository
{
    public class StudentRepository : IStudentRepository
    {
        private readonly MyDbContext _context;

        public StudentRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Student> AddAsync(Student student)
        {
            await _context.Students.AddAsync(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task<Student> Update(Student student)
        {
            _context.Students.Update(student);
            await _context.SaveChangesAsync();
            return student;
        }

        public async Task Remove(Student student)
        {
            _context.Students.Remove(student);
            await _context.SaveChangesAsync();
        }

        public async Task<Student> FindByIdAsync(int studentID)
        {
            return await _context.Students.FindAsync(studentID);
        }

        public Student FirstOrDefaultByStudentId(int studentID)
        {
            return _context.Students.FirstOrDefault(s => s.StudentID == studentID);
        }

        public async Task<List<Student>> GetAllAsync()
        {
            return await _context.Students.Include(s => s.Classes).ToListAsync();
        }
    }
}
