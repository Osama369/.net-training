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
		public string? DateDiffx { get; set; }

		[DisplayName(Name = "Credit Days")]
		public DateTime creditDays { get; set; }

	}
}
