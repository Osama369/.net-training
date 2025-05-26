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
    internal class ClassRepository : IClassRepository
    {
        private readonly MyDbContext _dbcontext;

        public ClassRepository(MyDbContext _dbcontext) {

            this._dbcontext = _dbcontext;
        }
        public async Task<Class> AddAsync(Class cls)
        {
             await _dbcontext.Classes.AddAsync(cls);
            // after add we have to savechange 
           await _dbcontext.SaveChangesAsync();
            return cls;
            
        }

        public async Task<Class> FindByIdAsync(int id)
        {
            try
            {
              var res =  await _dbcontext.Classes.FindAsync(id);
                return res;
            }catch(Exception ex)
            {

            }
              return new Class();
        }

        public List<Class> GetAll()
        {
            return _dbcontext.Classes.ToList();
            
        }

        public async Task RemoveAsync(Class cls)
        {
             _dbcontext.Classes.Remove(cls);
            await _dbcontext.SaveChangesAsync();
        }

        public async Task<Class> UpdateAsync(Class cls)
        {
            _dbcontext.Classes.Update(cls);
            await _dbcontext.SaveChangesAsync();
            return cls;
        }
    }
}
