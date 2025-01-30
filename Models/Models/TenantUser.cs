using System.ComponentModel.DataAnnotations;

namespace aiPriceGuard.Models.Models
{
    public class TenantUser
    {
        [Key]
        public int tenantUserID { get; set; }
        public int? tenantID { get; set; }
        public string? userID { get; set; }
        public string? email { get; set; }
        public bool? isPrimary { get; set; }
        public int? ordinal { get; set; }
        public bool? active { get; set; }
        public DateTime? created { get; set; }
        public string? crtBy { get; set; }
        public DateTime? updated { get; set; }
        public string? modBy { get; set; }

    }
}
