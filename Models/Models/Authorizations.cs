using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.Models
{
    public class Authorizations
    {
        [Key]
        public int authID { get; set; }
        public int? userID { get; set; }
        public int? screenID { get; set; }
        public bool? Add { get; set; }
        public bool? Edit { get; set; }
        public bool? Delete { get; set; }
        public bool? Print { get; set; }
        public bool? Find { get; set; }
        public bool? isShow { get; set; }

        [NotMapped]
        public string? screenName { get; set; }

        [NotMapped]
        public string? screenGrpName { get; set; }

        [NotMapped]
        public int? screenGrpID { get; set; }
    }
}
