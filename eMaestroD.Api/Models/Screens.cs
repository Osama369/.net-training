using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Api.Models
{
    public class Screens
    {
        [Key]
        public int screenID { get; set; }
        public int? screenGrpID { get; set; }
        public string? screenName { get; set; }
        public string? descr { get; set; }
        public string? path { get; set; }
        public bool? active { get; set; }

        [NotMapped]
        public string? screenParentName { get; set; }
    }
}
