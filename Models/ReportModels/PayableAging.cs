using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;
namespace eMaestroD.Models.ReportModels
{
    public class PayableAging : IEntityBase
    {
		[DisplayName(Name = "Balance Sum")]
		public decimal balSum { get; set; }

		[DisplayName(Name = "Debit Sum")]
		public decimal debitSum { get; set; }

		[DisplayName(Name = "Date")]
		public DateTime dtTx { get; set; }

		[DisplayName(Name = "Invoice No")]
		public string? voucherNo { get; set; }

		[DisplayName(Name = "Vendor Code")]
		public string? vendCode { get; set; }

		[DisplayName(Name = "Vendor Name")]
		public string? vendName { get; set; }

		[DisplayName(Name = "Date Diff")]
		public string? DateDiffx { get; set; }

		[DisplayName(Name = "Credit Days")]
		public DateTime creditDays { get; set; }
	}
}
