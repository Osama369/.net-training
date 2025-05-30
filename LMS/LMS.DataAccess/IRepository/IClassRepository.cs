using LMS.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.DataAccess.IRepository
{
    public interface IClassRepository
    {

        // add , update , remove , getAll getByID methods 

        Task<Class> AddAsync(Class cls);
        Task<Class> UpdateAsync(Class cls);
        Task RemoveAsync(Class cls);
        Task<Class> FindByIdAsync(int id);
        Task<List<Class>> GetAllAsync();


    }
}
