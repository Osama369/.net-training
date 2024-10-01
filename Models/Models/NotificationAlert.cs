using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Models.Models
{
    public class NotificationAlert
    {
        [Key]
        public int notificationAlertID { get; set; }
        public int comID { get; set; }
        public int roleID { get; set; }
        public int screenID { get; set; }
        public string? alerts { get; set; }
        public string? alertType { get; set; }
        public bool? onSave { get; set; }
        public bool? onEdit { get; set; }
        public bool? onDelete { get; set; }
        public bool? active { get; set; }
        public string? createdBy { get; set; }
        public DateTime? createdDate { get; set; }
        public string? modifiedBy { get; set; }
        public DateTime? modifiedDate { get; set; }

        [NotMapped]
        public string? roleName { get; set; }

        [NotMapped]
        public string? screenName { get; set; }

    }
}
