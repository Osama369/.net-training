using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class StockStatusCumulativeValuation : IEntityBase
    {

        [DisplayName(Name = "Code")]
        public string? prodCode { get; set; }
        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }
        [DisplayName(Name = "Bal")]
        public decimal total { get; set; }

        [HiddenOnRender]
        public string? prodUnit { get; set; }
        [HiddenOnRender]
        public DateTime asOfDate { get; set; }
    }
}
