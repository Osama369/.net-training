using LMS.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Services.IService
{
    public interface IClassService 
    {

        Task<Class> AddClassAsync(Class cls);
        Task<Class> UpdateClassAsync(Class cls);
        Task RemoveClassAsync(Class cls);
        Task<Class> GetClassByIdAsync(int id);
        Task<List<Class>> GetAllClassesAsync();

    }
}
