using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class FiscalYear
    {
        [Key]
        public int fID { get; set; }
        public int period { get; set; }
        public bool active { get; set; }
        public DateTime? dtStart { get; set; }
        public DateTime? dtEnd { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public int? comID { get; set; }
    }
}
