using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Custom;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.ReportModels 
{
    public class ExpenseReport : IEntityBase
    {
        

        [DisplayName(Name ="Date")]
        public DateTime? dtTx { get; set; }

        [DisplayName(Name = "treeName")]
        public string? treeName { get; set; }

        [DisplayName(Name = "details")]
        public string? details { get; set; }

        [DisplayName(Name ="Comment")]
        public string? Comment { get; set; }

        [DisplayName(Name="CR")]
        public decimal  CR { get; set; }

        [DisplayName(Name = "DR")]
        public decimal DR { get; set; }

    }
}
