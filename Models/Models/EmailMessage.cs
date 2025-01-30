using System.ComponentModel.DataAnnotations;

namespace aiPriceGuard.Models.Models
{
    public class EmailMessage
    {
        [Key]
        public int EmailMessageID { get; set; }
        public string? EmailMessageDisplayName { get; set; }
        public string? EmailMessageCode { get; set; }
        public string? EmailMessageType { get; set; }
        public string? Subject { get; set; }
        public string? FromEmail { get; set; }
        public string? FromDisplayName { get; set; }
        public string? ReplyToAddress { get; set; }
        public string? ToEmailAddress { get; set; }
        public string? MailCC { get; set; }
        public string? MailBCC { get; set; }
        public string? Body { get; set; }
        public string? Attachment { get; set; }
        public string? EmailFormat { get; set; }
        public int? MailPriority { get; set; }
        public int? Status { get; set; }
        public DateTime? created { get; set; }
        public string? crtBy { get; set; }
        public DateTime? updated { get; set; }
        public string? modBy { get; set; }

    }
}
