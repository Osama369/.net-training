using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.Models
{
    public class PaymentDetail
    {
        [Key]
        public string id { get; set; }
        public int? tenantId { get; set; }
        public DateTime createTime { get; set; }
        public DateTime updateTime { get; set; }
        public string intent { get; set; }
        public string status { get; set; }
        public string payerEmail { get; set; }
        public string payerId { get; set; }
        public string payerCountryCode { get; set; }
        public string payerGivenName { get; set; }
        public string payerSurname { get; set; }
        public string referenceId { get; set; }
        public decimal amountValue { get; set; }
        public string amountCurrency { get; set; }
        public string payeeEmail { get; set; }
        public string merchantId { get; set; }
        public string shippingFullName { get; set; }
        public string shippingAddressLine1 { get; set; }
        public string shippingAddressLine2 { get; set; }
        public string adminArea2 { get; set; }
        public string adminArea1 { get; set; }
        public string postalCode { get; set; }
        public string countryCode { get; set; }
        public string captureId { get; set; }
        public string captureStatus { get; set; }
        public DateTime captureCreateTime { get; set; }
        public DateTime captureUpdateTime { get; set; }
        public decimal captureAmountValue { get; set; }
        public string captureAmountCurrency { get; set; }
        public bool finalCapture { get; set; }
        public string sellerProtectionStatus { get; set; }
        public string disputeCategories { get; set; }
        public string selfLinkHref { get; set; }
        public string selfLinkRel { get; set; }
        public string selfLinkMethod { get; set; }
        public string selfLinkTitle { get; set; }
        public string refundLinkHref { get; set; }
        public string refundLinkRel { get; set; }
        public string refundLinkMethod { get; set; }
        public string refundLinkTitle { get; set; }
        public string upLinkHref { get; set; }
        public string upLinkRel { get; set; }
        public string upLinkMethod { get; set; }
        public string upLinkTitle { get; set; }
        public string subscriptionPlan { get; set; }
        public int? companiesCount { get; set; }
        public int? usersCount { get; set; }
        public int? locationCount { get; set; }
        public string? subscriptionDuration { get; set; }


        [NotMapped]
        public string? tenantEmailAddress { get; set; }
    }
}
