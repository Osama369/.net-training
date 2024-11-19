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
        public int? prodID { get; set; }
        public int? prodGrpID { get; set; }
        public string prodCode { get; set; }
        public string? shortName { get; set; }
        public string prodName { get; set; }
        public string descr { get; set; }
        public string prodUnit { get; set; }
        public decimal? unitQty { get; set; }
        public decimal? purchRate { get; set; }
        public decimal? sellRate { get; set; }
        public bool? isTaxable { get; set; }
        public bool? isStore { get; set; }
        public bool? isRaw { get; set; }
        public decimal? minQty { get; set; }
        public decimal? maxQty { get; set; }
        public string? mega { get; set; }
        public bool? active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public int? comID { get; set; }
        public decimal? retailPrice { get; set; }
        public decimal? tp { get; set; }
        public bool? isBonus { get; set; }
        public bool? isDiscount { get; set; }
        public int? prodManuID { get; set; }
        public int? depID { get; set; }
        public int? categoryID { get; set; }
        public bool? isImported { get; set; }
        public string? prodSize { get; set; }
        public string? prodColor { get; set; }

        // ProductBarCodes Table Fields

        [Key]
        public int? prodBCID { get; set; }
        public string? barCode { get; set; }
        public decimal? costPrice { get; set; }
        public decimal? salePrice { get; set; }
        public decimal? tradePrice { get; set; }
        public string? unit { get; set; }
        public decimal? fobPrice { get; set; }

        // ProdManufactures Table Fields
        public string? prodManuName { get; set; }

        // Departments Table Fields
        public string? depName { get; set; }

        // Categories Table Fields
        public string? categoryName { get; set; }

        // ProdGroups Table Fields
        public string? prodGrpName { get; set; }
        public decimal? lastCost { get; set; }
        public decimal? currentStock  { get; set; }
        public decimal? sellPrice { get; set; }
    }
}
