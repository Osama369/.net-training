using eMaestroD.Models.Custom;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class COA : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int COAID { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }
        [HiddenOnRender]
        public int parentCOAID { get; set; }
        [HiddenOnRender]
        public int? COANo { get; set; }
        [HiddenOnRender]
        public int? COAlevel { get; set; }
        [HiddenOnRender]
        public bool isSys { get; set; }
        [HiddenOnRender]
        public string? acctNo { get; set; }
        [HiddenOnRender]
        public string? parentAcctNo { get; set; }
        [HiddenOnRender]
        public string? acctType { get; set; }
        [DisplayName(Name = "Bank Name")]
        [UpperCase]
        public string? acctName { get; set; }
        [HiddenOnRender]
        public string? acctDescr { get; set; }
        [HiddenOnRender]
        public string? parentAcctType { get; set; }
        [HiddenOnRender]
        public string? parentAcctName { get; set; }
        [HiddenOnRender]
        public string? treeName { get; set; }
        [HiddenOnRender]
        public string? path { get; set; }
        [HiddenOnRender]
        public decimal? bal { get; set; }
        [HiddenOnRender]
        public decimal? openBal { get; set; }
        [HiddenOnRender]
        public decimal? closingBal { get; set; }
        [HiddenOnRender]
        public string? nextChkNo { get; set; }
        [HiddenOnRender]
        public DateTime? lastReconciled { get; set; }
        [HiddenOnRender]
        public string? QBListID { get; set; }
        [HiddenOnRender]
        public bool active { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modBy { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }

        [NotMapped]
        [HiddenOnRender]
        public List<COA>? children = new List<COA>();

    }
}
