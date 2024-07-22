using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Api.Models
{
    public class AuthorizationsTemplate
    {
        [Key]
        public int authTemplateID { get; set; }
        public int? roleID { get; set; }
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
