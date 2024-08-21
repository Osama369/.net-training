using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
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
    }
}
