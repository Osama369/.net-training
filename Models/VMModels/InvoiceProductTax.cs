using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.VMModels
{
    public class InvoiceProductTax
    {
        public int taxDetailID { get; set; } = 0;
        public string? taxAcctNo { get; set; }
        public decimal? taxPercent { get; set; }
        public decimal? taxAmount { get; set; }
    }
}
