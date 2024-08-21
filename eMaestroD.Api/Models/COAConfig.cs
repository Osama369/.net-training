using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class COAConfig
    {
        [Key]
        public int coaConfigID {get; set;}
        public string? key {get; set;}
        public string? acctNo { get; set; }
    }
}
