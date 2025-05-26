using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.DataAccess.IRepositories
{
    public interface IClassRepository
    {
        Task<Class> AddAsync(Class cls);
        Task<Class> UpdateAsync(Class cls);
        Task RemoveAsync(Class cls);
        Task<Class> FindByIdAsync(int id);
        List<Class> GetAll();
    }
}
