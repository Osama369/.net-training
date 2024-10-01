using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class FiscalBalances
    {
        [Key]
        public int fbID { get; set; }
        public int? cstID { get; set; }
        public int? vendID { get; set; }
        public int? fiscalYear { get; set; }
        public decimal? openBal { get; set; }
        public bool? active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public decimal? closingBal { get; set; }
        public decimal? lastFA { get; set; }
        public decimal? lastClosing { get; set; }
        public string? nextChkNo { get; set; }
        public DateTime? lastReconciled { get; set; }
        public decimal? bal { get; set; }
        public int? parentCOAID { get; set; }
        public int? comID { get; set; }
    }
}
