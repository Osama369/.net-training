using eMaestroD.Models.Custom;
using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class ProdDiscount : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int prodDiscID { get; set; }
        [HiddenOnRender]
        public int? prodID { get; set; }
        [HiddenOnRender]
        public int? offerID { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }
        [DisplayName(Name = "Start Date")]
        public DateTime dtStart { get; set; }
        [DisplayName(Name = "End Date")]
        public DateTime dtEnd { get; set; }
        [DisplayName(Name = "Scheme Name")]
        public string? descr { get; set; }
        [DisplayName(Name = "QTY")]
        public decimal startQty { get; set; }
        [DisplayName(Name = "Max QTY")]
        public decimal maxQty { get; set; }
        [DisplayName(Name = "Max Amount")]
        public decimal maxAmount { get; set; }
        [DisplayName(Name = "Discount")]
        public decimal discount { get; set; }
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
        public int? cstID { get; set; }
    }
}
