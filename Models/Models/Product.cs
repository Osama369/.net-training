using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class Product : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int prodID { get; set; }
        [HiddenOnRender]
        public int prodGrpID { get; set; }
        //public Int32 prodGrpID { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }

        //public String? comName { get; set; }

        //public String? prodGrpName { get; set; }


        [NotMapped]
        [DisplayName(Name = "BRAND")]
        public string? prodGrpName { get; set; }
        //[NotMapped]
        //[DisplayName(Name = "Supplier Name")]
        //public string? vendName { get; set; }

        [DisplayName(Name = "Code")]
        public string? prodCode { get; set; }


        [DisplayName(Name = "Name")]
        [UpperCase] 
        public string? prodName { get; set; }
        [HiddenOnRender]
        public String? shortName { get; set; }

        [DisplayName(Name = "Type")]
        public string? descr { get; set; }
        [DisplayName(Name = "Unit")]
        public string? prodUnit { get; set; } = "";
        [HiddenOnRender]
        public decimal unitQty { get; set; } = 0;

        [HiddenOnRender]
        [NotMapped]
        public decimal qty { get; set; } = 0;

        [DisplayName(Name = "Purchase Rate")]
        public decimal purchRate { get; set; } = 0;

        [DisplayName(Name = "Sell Rate")]
        public decimal sellRate { get; set; } = 0;
        [HiddenOnRender]
        public decimal retailprice { get; set; } = 0;
        [HiddenOnRender]
        public decimal tP { get; set; } = 0;
        [HiddenOnRender]
        public bool? isTaxable { get; set; }

        //public Boolean isRaw { get; set; }

        //public Boolean isBonus { get; set; }
        [DisplayName(Name = "Min Qty")]
        public decimal? minQty { get; set; }
        [DisplayName(Name = "Max Qty")]
        public decimal? maxQty { get; set; }
        [DisplayName(Name = "Allow Serial No")]
        public bool? isStore { get; set; }

        [NotMapped]
        [HiddenOnRender]
        public decimal? tax { get; set; }

        //public Boolean mega { get; set; }
        [HiddenOnRender]
        public bool active { get; set; }

        //public String? crtBy { get; set; }

        //public DateTime crtDate { get; set; }

        //public String? modby { get; set; }

        //public DateTime ? modDate { get; set; }
        [HiddenOnRender]
        public string? productList { get { return prodName + " " + prodCode; } }

        [HiddenOnRender]
        [NotMapped]
        public string? comment { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public string? taxName { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public byte[]? barcodeImage { get; set; }

        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modby { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }

        [HiddenOnRender]
        [NotMapped]
        public List<ProductBarCodes> ProductBarCodes { get; set; }

        [HiddenOnRender]
        public int? prodManuID { get; set; }
        [HiddenOnRender]
        public int? depID { get; set; }
        [HiddenOnRender]
        public int? categoryID { get; set; }
        [HiddenOnRender]
        public Boolean? isImported { get; set; }
        [HiddenOnRender]
        public string? prodSize { get; set; }
        [HiddenOnRender]
        public string? prodColor { get; set; }
        [HiddenOnRender]
        public bool? isDiscount { get; set; }
    }

    public class Stock
    {
        [Key]
        public int prodID { get; set; }
        public int prodBCID { get; set; }
        public string? prodName { get; set; }
        public string? barCode { get; set; }
        public decimal qty { get; set; }
        public decimal qtyBal { get; set; }
        public decimal bonusQty { get; set; }
        public string? batchNo { get; set; }
    }
}
