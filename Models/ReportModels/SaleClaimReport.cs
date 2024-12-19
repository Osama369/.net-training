using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;
namespace eMaestroD.Models.ReportModels
{
    public class SaleClaimReport :IEntityBase
    {	
		[DisplayName(Name ="Date")]
		public DateTime dtTx { get; set; }

		[DisplayName(Name = "Invoice No")]
		public string? voucherNo { get; set; }

		[DisplayName(Name = "Batch No")]
		public string? batchNo { get; set; }

		[DisplayName(Name = "Amount")]
		public decimal Amount { get; set; }

		[DisplayName(Name = "claim")]
		public decimal claim { get; set; }

		[HiddenOnRender]
		[DisplayName(Name = "companyName")]
		public string? companyName { get; set; }

		[DisplayName(Name = "Product Code")]
		public string? prodCode { get; set; }

		[DisplayName(Name = "Product Name")]
		public string? prodName { get; set; }

		[DisplayName(Name = "Product Unit")]
		public string? prodUnit { get; set; }

		[HiddenOnRender]
		[DisplayName(Name = "Start Date")]
		public DateTime dtStart { get; set; }

		[HiddenOnRender]
		[DisplayName(Name = "End Date")]
		public DateTime dtEnd { get; set; }

		
	}
}
