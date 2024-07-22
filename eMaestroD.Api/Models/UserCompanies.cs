using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class UserCompanies
    {
        [Key]
        public int? UserComID { get; set; }
        public int? UserID { get; set; }
        public int? ComID { get; set; }

    }
}
