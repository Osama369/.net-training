using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace aiPriceGuard.Models.Models
{
    public class Users
    {
        [Key]
        public int? UserID { get; set; }
        public int? TenantID { get; set; }
        public int? ComID { get; set; }
        public int? RoleID { get; set; }
        [NotMapped]
        public int? locID { get; set; }

        [NotMapped]
        public string? RoleName { get; set; }
        [NotMapped]
        public string? password { get; set; }

        [NotMapped]
        public string? Companies { get; set; }

        public string? Title { get; set; }
        public string? Prefix { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? BusinessPhone { get; set; }
        public string? PhoneExt { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? ProfilePic { get; set; }
        public string? Notes { get; set; }
        public int? Ordinal { get; set; }
        public bool? Active { get; set; }
        public DateTime? Created { get; set; }
        public string? crtBy { get; set; }
        public DateTime? Updated { get; set; }
        public string? modBy { get; set; }
        public bool? AllowExport { get; set; }
        public bool? IsMultiLogin { get; set; }
        public bool? isAllowLogin { get; set; }
        [NotMapped]
        public string? locations { get; set; }
        [NotMapped]
        public string? userName { get { return FirstName + " " + LastName; } }
    }
}
