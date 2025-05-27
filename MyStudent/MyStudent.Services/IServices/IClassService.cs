using MyStudent.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Services.IServices
{
    public interface IClassService

    {
        Task<Class> AddClassAsync(Class cls);
        Task<Class> UpdateClassAsync(Class cls);


        Task<Class> GetClassByIdAsync(int id);

        Task RemoveClassAsync(Class cls);
        Task<List<Class>> GetAllClassesAsync();


    }
}
