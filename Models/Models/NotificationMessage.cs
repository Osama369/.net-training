using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.Models
{
    public class NotificationMessage
    {
        [Key]
        public int notificationMessageID { get; set; }
        public int? comID { get; set; }
        public int? userID { get; set; }
        public string? voucherNo { get; set; }
        public string? message { get; set; }
        public bool? active { get; set; }
        public string? createdBy { get; set; }
        public DateTime? createdDate { get; set; }
        public string? modifiedBy { get; set; }

        public DateTime? modifiedDate { get; set; }

        [NotMapped]
        public string? username { get; set; }
        [NotMapped]
        public string? email { get; set; }

    }
}
