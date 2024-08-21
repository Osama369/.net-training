using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class VendorCompany
    {
        [Key]
        public int vendComID { get; set; }
        public int vendID { get; set; }
        public int comID { get; set; }
        public bool active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
    }
}
