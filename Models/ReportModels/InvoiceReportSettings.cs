using System.ComponentModel.DataAnnotations;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
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
