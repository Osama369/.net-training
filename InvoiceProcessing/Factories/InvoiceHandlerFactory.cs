using eMaestroD.DataAccess.Repositories;
using eMaestroD.InvoiceProcessing.Handlers;
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
        private readonly HelperMethods _helperMethods;
        public InvoiceHandlerFactory(HelperMethods helperMethods)
        {
            _helperMethods = helperMethods;
        }

        public IInvoiceHandler GetInvoiceHandler(int txTypeID)
        {
            return txTypeID switch
            {
                1 => new PurchaseInvoiceHandler(_helperMethods),
                12 => new GRNInvoiceHandler(_helperMethods),
                _ => throw new NotSupportedException($"Invoice type with txTypeID {txTypeID} is not supported.")
            };
        }
    }
}
