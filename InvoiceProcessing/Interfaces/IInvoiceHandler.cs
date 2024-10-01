using eMaestroD.Models.Models;
using eMaestroD.Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace InvoiceProcessing.Interfaces
{
    public interface IInvoiceHandler
    {
        Task<List<GL>> ConvertInvoiceToGL(Invoice invoice);
    }
}
