using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class Locations
    {
        [Key]
        public int locID { get; set; }

        public int? locTypeID { get; set; }
        public int? comID { get; set; }
        public string? locCode { get; set; }

        public string? locName { get; set; }

        public string? descr { get; set; }

        public string? locAddress { get; set; }

        public string? locPhone { get; set; }

        //public String? locFax { get; set; }

        public bool? active { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }

        //public String? crtBy { get; set; }

        //public DateTime? crtDate { get; set; }

        //public String? modby { get; set; }

        //public DateTime? modDate { get; set; }

    }
}
