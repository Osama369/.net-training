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
    public class ClassService : IClassService
    {
        private readonly IClassRepository _classRepository;

        public ClassService(IClassRepository classRepository)
        {
            _classRepository = classRepository;
        }

        public async Task<Class> AddClassAsync(Class cls)
        {
          return  await _classRepository.AddAsync(cls);

        }

        public async Task<List<Class>> GetAllClassesAsync()
        {
          return  await _classRepository.GetAllAsync();
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
