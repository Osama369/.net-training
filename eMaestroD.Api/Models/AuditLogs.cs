using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class AuditLogs
    {

        [Key]
        public int auditLogID { get; set; }
        public string? methodName { get; set; }
        public string? voucherNo { get; set; }
        public string? oldValues { get; set; }
        public string? actionName { get; set; }
        public string? logBy { get; set; }
        public DateTime? logDate { get; set; }
    }
}
