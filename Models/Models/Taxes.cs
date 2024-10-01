using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.Models
{
    public class Taxes
    {
        [Key]
        public int TaxID { get; set; }
        public string? TaxName { get; set; }
        public int? comID { get; set; }
        public decimal? taxValue { get; set; }
        public bool? isDefault { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modby { get; set; }
        public DateTime? modDate { get; set; }
        [NotMapped]
        public string? acctNo { get; set; } 
    }
}
