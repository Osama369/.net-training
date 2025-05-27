using MyStudent.DataAccess.IRepositories;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Services.Services
{
    public class ClassService : IClassService
    {
        // will use Iclassrepository 
        private readonly IClassRepository _classRepository;

        public ClassService(IClassRepository _classRepository)
        {
            this._classRepository = _classRepository;
        }

        public async Task<Class> AddClassAsync(Class cls)
        {
            return await _classRepository.AddAsync(cls);

            
        }

        public async Task<List<Class>> GetAllClassesAsync()
        {
            return await _classRepository.GetAllClassesAsync();
        }

        public async Task<Class> GetClassByIdAsync(int id)
        {
           return await _classRepository.FindByIdAsync(id);
            
        }

        public async Task RemoveClassAsync(Class cls)
        {
            await _classRepository.RemoveAsync(cls);
           
        }

        public async Task<Class> UpdateClassAsync(Class cls)
        {
            return await _classRepository.UpdateAsync(cls);
           
        }
    }
}
