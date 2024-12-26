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
		[DisplayName(Name = "Date")]
		public DateTime dtTx { get; set; }

		[link]
		[DisplayName(Name = "Invoice No")]
		public string? voucherNo { get; set; }

		[DisplayName(Name = "Supplier")]
		public string? vendName { get; set; }

		[HiddenOnRender]
		[DisplayName(Name = "Vendor Code")]
		public string? vendCode { get; set; }

		[DisplayName(Name = "Balance Sum")]
		public decimal balSum { get; set; }

		[DisplayName(Name = "Debit Sum")]
		public decimal debitSum { get; set; }

		[DisplayName(Name = "Date Diff")]
		public int DateDiffx { get; set; }
		
		[DisplayName(Name = "Pay Off")]
		
		public decimal PayOff { get; set; }
		
		[DisplayName(Name = "Thirty Days")]
		public decimal ThirtyDays { get; set; }
		
		[DisplayName(Name = "Sixty Days")]
		public decimal SixtyDays { get; set; }
		
		[DisplayName(Name = "Ninety Days")]
		public decimal NinetyDays { get; set; }
		
		[DisplayName(Name = "One Fifty Days")]		
		public decimal OneFiftyDays { get; set; }
		
		[DisplayName(Name = "Three Sixty Days")]
		public decimal ThreeSixtyDays { get; set; }
		
		//[DisplayName(Name = "Credit Days")]
		//public DateTime creditDays { get; set; }
	}
}
