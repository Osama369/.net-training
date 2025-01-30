using System.ComponentModel.DataAnnotations;

namespace aiPriceGuard.Models.Models
{
    public class UserCompanies
    {
        [Key]
        public int? UserComID { get; set; }
        public int? UserID { get; set; }
        public int? ComID { get; set; }

    }
}
