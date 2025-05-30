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
    public class CLassRepository : IClassRepository
    {
        private readonly MyDbContext _context;

        public CLassRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task<Class> AddAsync(Class cls)
        {
            await _context.Classes.AddAsync(cls);
            await _context.SaveChangesAsync();
            return cls;
           
        }

        public async Task<Class> FindByIdAsync(int id)
        {
            return await _context.Classes.FindAsync(id);
        }

        public async Task<List<Class>> GetAllAsync()
        {
            return await _context.Classes.ToListAsync();
        }

        public async Task RemoveAsync(Class cls)
        {
             _context.Classes.Remove(cls);
              await _context.SaveChangesAsync();

        }

        public async Task<Class> UpdateAsync(Class cls)
        {
            _context.Classes.Update(cls);
            await _context.SaveChangesAsync();
            return cls;
        }
    }
}
