using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Models.VMModels
{
    public class ProductViewModel : IEntityBase
    {
        [DisplayName(Name = "Product Barcode")]
        public string? barCode { get; set; }
        [DisplayName(Name = "Product Name")]
        public string prodName { get; set; }
        [DisplayName(Name = "Manufacture")]
        public string? prodManuName { get; set; }
        [DisplayName(Name = "Department")]
        public string? depName { get; set; }
        [DisplayName(Name = "Category")]
        public string? categoryName { get; set; }
        [DisplayName(Name = "Brand")]
        public string? prodGrpName { get; set; }
        [DisplayName(Name = "Purchase Rate")]
        public decimal? purchRate { get; set; }
        [DisplayName(Name = "Sell Rate")]
        public decimal? sellPrice { get; set; }
        [DisplayName(Name = "Current Stock")]
        public decimal? currentStock { get; set; }
        [DisplayName(Name = "Min Qty")]
        public decimal? minQty { get; set; }
        [DisplayName(Name = "Max Qty")]
        public decimal? maxQty { get; set; }
        [DisplayName(Name = "Size")]
        public string? prodSize { get; set; }
        [DisplayName(Name = "Color")]
        public string? prodColor { get; set; }
        public bool? isTaxable { get; set; }
        public bool? isImported { get; set; }

        [HiddenOnRender]
        public int? prodID { get; set; }
        [HiddenOnRender]
        public int? prodGrpID { get; set; }
        [HiddenOnRender]
        public string prodCode { get; set; }
        [HiddenOnRender]
        public string? shortName { get; set; }
        [HiddenOnRender]
        public string descr { get; set; }
        [HiddenOnRender]
        public string prodUnit { get; set; }
        [HiddenOnRender]
        public decimal? unitQty { get; set; }

        [HiddenOnRender]
        public decimal? sellRate { get; set; }

        [HiddenOnRender]
        public bool? isStore { get; set; }
        [HiddenOnRender]
        public bool? isRaw { get; set; }
        [HiddenOnRender]
        public string? mega { get; set; }
        [HiddenOnRender]
        public bool? active { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modBy { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }
        [HiddenOnRender]
        public decimal? retailPrice { get; set; }
        [HiddenOnRender]
        public decimal? tp { get; set; }
        [HiddenOnRender]
        public bool? isBonus { get; set; }
        [HiddenOnRender]
        public bool? isDiscount { get; set; }
        [HiddenOnRender]
        public int? prodManuID { get; set; }
        [HiddenOnRender]
        public int? depID { get; set; }
        [HiddenOnRender]
        public int? categoryID { get; set; }
      

        // ProductBarCodes Table Fields

        [Key]
        [HiddenOnRender]
        public int? prodBCID { get; set; }
  
        [HiddenOnRender]
        public decimal? costPrice { get; set; }
        [HiddenOnRender]
        public decimal? salePrice { get; set; }
        [HiddenOnRender]
        public decimal? tradePrice { get; set; }
        [HiddenOnRender]
        public string? unit { get; set; }
        [HiddenOnRender]
        public decimal? fobPrice { get; set; }
        [HiddenOnRender]
        public decimal? lastCost { get; set; }
        [HiddenOnRender]
        public int? vendID { get; set; }
        [HiddenOnRender]
        public string? vendName { get; set; }
        [HiddenOnRender]
        public int? preference { get; set; }
        [HiddenOnRender]
        public decimal? sharePercentage { get; set; }
    }
}
