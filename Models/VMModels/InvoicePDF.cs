using aiPriceGuard.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.VMModels
{
    public class InvoicePDF
    {
        public Supplier supplier { get; set; }
        public Invoice InvoiceDetails { get; set; }

    }
}
