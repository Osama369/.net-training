using eMaestroD.DataAccess.IRepositories;
using eMaestroD.InvoiceProcessing.Handlers;
using eMaestroD.InvoiceProcessing.Interfaces;
using InvoiceProcessing.Interfaces;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.InvoiceProcessing.Factories
{
    public class InvoiceHandlerFactory
    {
        private readonly IHelperMethods _helperMethods;
        public InvoiceHandlerFactory(IHelperMethods helperMethods)
        {
            _helperMethods = helperMethods;
        }

        public IInvoiceHandler GetInvoiceHandler(int txTypeID, IGLService _glService)
        {
            return txTypeID switch
            {
                1 => new PurchaseInvoiceHandler(_helperMethods, _glService),
                2 => new PurchaseReturnHandler(_helperMethods, _glService),
                3 => new PurchaseOrderHandler(_helperMethods, _glService),
                4 => new SaleInvoiceHandler(_helperMethods, _glService),
                12 => new GRNInvoiceHandler(_helperMethods, _glService),
                _ => throw new NotSupportedException($"Invoice type with txTypeID {txTypeID} is not supported.")
            };
        }
    }
}
