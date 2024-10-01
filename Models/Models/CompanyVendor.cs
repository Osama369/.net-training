using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class CompanyVendor
    {
        [Key]
        public int ComVendID { get; set; }
        public int ComID { get; set; }
        public int VendID { get; set; }
    }
}
