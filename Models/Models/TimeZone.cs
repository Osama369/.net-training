using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class TimeZones
    {
        [Key]
        public int? timeZoneID { get; set; }
        public string? timeZone { get; set; }
        public string? current_utc_offset { get; set; }
        public string? is_currently_dst { get; set; }
        public int? ordinal { get; set; }
        public bool? active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public bool? isDefault { get; set; }
        public string? abbreviation { get; set; }
    }
}
