using eMaestroD.Api.Common;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class StockList : IEntityBase
    {

        [DisplayName(Name = "Code")]
        public string? BarCode { get; set; }
        [DisplayName(Name = "Product Name")]
        public string? prodName { get; set; }
        [DisplayName(Name = "Unit Price")]
        public decimal unitPrice { get; set; }
        [DisplayName(Name = "Available Quantity")]
        public decimal AvailableQty { get; set; }
        [HiddenOnRender]
        public decimal OrderedQty { get; set; }
        [HiddenOnRender]
        public decimal bonusQty { get; set; }
        [Key]
        [HiddenOnRender]
        public int prodID { get; set; }

        [HiddenOnRender]
        public string? Unit { get; set; }
        [HiddenOnRender]
        public int comID { get; set; }
        [HiddenOnRender]
        public int prodGrpID { get; set; }
        [HiddenOnRender]
        public int locID { get; set; }

    }
}
