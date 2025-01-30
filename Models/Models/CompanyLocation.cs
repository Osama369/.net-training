using System.ComponentModel.DataAnnotations;

namespace aiPriceGuard.Models.Models
{
    public class CompanyLocation
    {
        [Key]
        public int ComLocID { get; set; }
        public int ComID { get; set; }
        public int LocID { get; set; }
    }
}
