using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class Tenants
    {
        [Key]
        public int tenantID { get; set; }
        public string? tenantName { get; set; }
        public string? companyLogo { get; set; }
        public string? companyurl { get; set; }
        public string? address1 { get; set; }
        public string? address2 { get; set; }
        public string? city { get; set; }
        public string? state { get; set; }
        public string? zip { get; set; }
        public string? country { get; set; }
        public string? title { get; set; }
        public string? prefix { get; set; }
        public string? firstName { get; set; }
        public string? lastName { get; set; }
        public string? businessPhone { get; set; }
        public string? phoneExt { get; set; }
        public string? mobile { get; set; }
        public string? email { get; set; }
        public string? password { get; set; }
        public string? profilePic { get; set; }
        public bool? isEmailConfirmed { get; set; }
        public bool? allowExport { get; set; }
        public bool? isMultiLocation { get; set; }
        public bool? isMultiCompany { get; set; }
        public bool? isMultilingual { get; set; }
        public bool? isPOS { get; set; }
        public bool? isSuspended { get; set; }
        public DateTime? subscriptionDate { get; set; }
        public DateTime subscriptionEndDate { get; set; }
        public string? subscriptionType { get; set; }
        public string? connectionString { get; set; }
        public string? serverName { get; set; }
        public string? initialCatalog { get; set; }
        public string? dbUser { get; set; }
        public string? dbPass { get; set; }
        public string? verificationCode { get; set; }
        public string? notes { get; set; }
        public int? ordinal { get; set; }
        public bool? active { get; set; }
        public DateTime? created { get; set; }
        public string? crtBy { get; set; }
        public DateTime? updated { get; set; }
        public string? modBy { get; set; }
        public int? maxUserCount { get; set; }
        public int? maxCompaniesCount { get; set; }
        public int? maxLocationCount { get; set; }
        public DateTime? lastLoginDate { get; set; }
    }
}
