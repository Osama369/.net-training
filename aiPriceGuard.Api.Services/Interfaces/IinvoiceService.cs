using aiPriceGuard.Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Interfaces
{
    public interface IinvoiceService
    {
        Task<RenderJson> GetRenderFormatData(InvoicePDF invoice, int supplierID, int comID,int suppFileId);
        Task<RenderJson> SaveJsonData(RenderJson jsonObj);
    }
}
