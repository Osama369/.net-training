using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.DataAccess.Repositories
{
    public class FileUploadRepository:IFileUploadRepository
    {
        private readonly AMDbContext _dbContext;
      
        public FileUploadRepository(AMDbContext _dbcontext)
        {
                this._dbContext = _dbcontext;
        }

        public async Task<FileModel> AddAsync(FileModel file)
        {
           await _dbContext.File.AddAsync(file);
           await _dbContext.SaveChangesAsync();
            return file;
        }

        public List<FileModel> GetAllFileWithSupplier(int? comID)
        {
            var fileList = (from filetble in _dbContext.File
                            join suppFile in _dbContext.SupplierFile
                            on filetble.FileId equals suppFile.FileId
                            join supplier in _dbContext.Supplier
                            on suppFile.SupplierId equals supplier.SupplierId
                            where filetble.comID == comID
                            select new FileModel
                            {
                                FileId = filetble.FileId,
                                FileName = filetble.FileName,
                                FileSize = filetble.FileSize,
                                FileType = filetble.FileType,
                                FileUrl = filetble.FileUrl,
                                MimeType = filetble.MimeType,
                                comID = filetble.comID,
                                Status = filetble.Status,
                                supplierName = supplier.SupplierName,
                                supplierID = supplier.SupplierId.Value
                            }).ToList();
            return fileList;
           
        }

        public async  Task SaveChangesAsync()
        {
            
        }
    }
}
