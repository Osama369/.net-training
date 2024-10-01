using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class UserCompanies
    {
        [Key]
        public int? UserComID { get; set; }
        public int? UserID { get; set; }
        public int? ComID { get; set; }

    }
}
