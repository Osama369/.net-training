
using eMaestroD.Models.VMModels;

namespace eMaestroD.Api.Common
{
    public class InvoiceValidationService
    {
        public bool ValidateInvoiceTotals(Invoice invoice)
        {
            if (invoice == null || invoice.Products == null || !invoice.Products.Any())
            {
                return false;
            }

            decimal calculatedGrossTotal = 0;

            foreach (var product in invoice.Products)
            {
                decimal productTotal = (product.purchRate ?? 0) * (product.qty ?? 0);
                decimal discount = product.discountAmount ?? 0;
                decimal extradiscount = product.extraDiscountAmount ?? 0;
                decimal tax = product.ProductTaxes.Sum(x=>x.taxAmount) ?? 0;
                decimal rebate = product.rebateAmount ?? 0;

                decimal productGross = productTotal -  discount - extradiscount  + tax - rebate;
                calculatedGrossTotal += productGross;
            }

            return Math.Round(calculatedGrossTotal, 2) == Math.Round(invoice.netTotal ?? 0, 2);
        }

        //public bool IsBatchNoValid(Invoice invoice)
        //{
        //    foreach (var product in invoice.Products)
        //    {
        //        if (!string.IsNullOrEmpty(product.batchNo))
        //        {
        //            bool batchExistsInGLEntries = CheckIfBatchExistsInGLEntries(product.batchNo);

        //            if (batchExistsInGLEntries)
        //            {
        //                return false;
        //            }
        //        }
        //    }

        //    return true;
        //}
    }
}
