using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using eMaestroD.Api.Common;

namespace eMaestroD.Api.Models
{
    public class ProfitAndLoss : IEntityBase
    {

        [DisplayName(Name = "Income Statement")]
        public string? parentAcctType { get; set; }

        [DisplayName(Name = "Name")]
        public string? treeName { get; set; }

        [HiddenOnRender]
        public string? AccountType { get; set; }

        public decimal DR { get; set; }
        public decimal CR { get; set; }
        public decimal ExCr { get; set; }

        [HiddenOnRender]
        public DateTime dtStart { get; set; }
        [HiddenOnRender]
        public DateTime dtEnd { get; set; }
    }
}
