using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.IRepositories
{
    public interface IFileUploadRepository
    {
        Task<FileModel> AddAsync(FileModel file);
        List<FileModel> GetAllFileWithSupplier(int? comID);
        Task SaveChangesAsync();
        

    }
}
