using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Interfaces
{
    public interface IFileUploadService
    {
        List<FileModel> GetAllFileWithSupplier(int? Id);
        Task<FileModel> AddFile(FileModel model);
        //Task<RenderJson> GetRenderFormatData(InvoicePDF invoice, int supplierID, int comID);
    }
}
