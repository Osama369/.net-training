using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels
{
    public  class ReceivableAging :IEntityBase
    {

 //       G.[balSum], G.[debitSum], G.[dtTx], G.[voucherNo]
	//,CST.[cstCode], CST.[cstName]
	//,DATEDIFF(DAY, G.[dtTx], @asOfDate)-CST.[creditDays] AS DateDiffx
	
	//,CST.[creditDays]

		[DisplayName(Name ="Balance Sum")]
		public decimal balSum { get; set; }

		[DisplayName(Name = "Debit Sum")]
		public decimal debitSum { get; set; }

		[DisplayName(Name = "Date")]
		public DateTime dtTx { get; set; }

		[DisplayName(Name = "Invoice No")]
		public string? voucherNo { get; set; }

		[DisplayName(Name = "Customer Code")]
		public string? cstCode { get; set; }

		[DisplayName(Name = "Customer Name")]
		public string? cstName { get; set; }

		[DisplayName(Name = "Date Diff")]
		public int? DateDiffx { get; set; }

        [DisplayName(Name = "Credit Days")]
        public string? creditDays { get; set; }
        
		[DisplayName(Name = "Pay Off")]

		public decimal PayOff { get; set; }

		[DisplayName(Name = "Thirty Days")]
		public decimal ThirtyDays { get; set; }

		[DisplayName(Name = "Sixty Days")]
		public decimal SixtyDays { get; set; }

		[DisplayName(Name = "Ninety Days")]
		public decimal NinetyDays { get; set; }
			

		[DisplayName(Name = "One Twenty Days")]
		public decimal OneTwentyDays { get; set; }

		[DisplayName(Name = "One Fifty Days")]
		public decimal OneFiftyDays { get; set; }
	}
}
