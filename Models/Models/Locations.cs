using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class Locations
    {
        [Key]
        public int LocationId { get; set; }
        public int? ParentLocationId { get; set; }
        public string? LocationName { get; set; }
        public int? LocTypeId { get; set; }
        public bool? active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public int? comID { get; set; }
    }
}
