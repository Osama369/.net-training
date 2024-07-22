using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class ReportSettings
    {
        [Key]
        public int id { get; set; }
        public string key { get; set; }
        public bool value { get; set; }

    }
}
