using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

//tab1.[GLID],
// tab1.[dtTx] ,
// tab2.salemanName,
// tab2.cstName, 
// tab1.voucherNo ,
// tab1.TotalSum AS unitPrice,
// CAST(tab2.[EmpPercentage] AS decimal)/100 * tab1.TotalSum AS SalePerson,
// tab1.[dtStart], 
// tab1.[dtEnd]


namespace eMaestroD.Models.ReportModels
{
    public class SaleManWiseSaleReport : IEntityBase
    {
        [HiddenOnRender]
        [DisplayName(Name ="GLID")]
        public int? GLID { get; set; }


        [DisplayName(Name = "Date")]
        public DateTime dtTx { get; set; }


        [DisplayName(Name = "Saleman Name")]
        public string? salemanName { get; set; }


        [DisplayName(Name = "Customer Name")]
        public string? cstName { get; set; }

        [DisplayName(Name = "Invoice No")]
        public string? voucherNo { get; set; }

        [DisplayName(Name = "Unit Price")]
        public decimal unitPrice { get; set; }


        [DisplayName(Name = "Sale Person")]
        public decimal SalePerson { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "Start Date")]
        public DateTime dtStart { get; set; }

        [HiddenOnRender]
        [DisplayName(Name = "End Date")]
        public DateTime dtEnd { get; set; }
    }
}
