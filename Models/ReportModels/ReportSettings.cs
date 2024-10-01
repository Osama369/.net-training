using System.ComponentModel.DataAnnotations;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public class ReportSettings
    {
        [Key]
        public int id { get; set; }
        public string key { get; set; }
        public bool value { get; set; }

    }
}
