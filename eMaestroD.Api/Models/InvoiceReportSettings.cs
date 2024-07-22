using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class InvoiceReportSettings
    {
        [Key]
        public int invoiceReportSettingID { get; set; }
        public string? screenName { get; set; }
        public string? key { get; set; }
        public bool value { get; set; }
        public string? type { get; set; }

    }
}
