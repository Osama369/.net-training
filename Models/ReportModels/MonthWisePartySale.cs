using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;
using eMaestroD.Models.Custom;

namespace eMaestroD.Models.ReportModels
{
    public class MonthWisePartySale: IEntityBase
    {
        public string customerName { get; set; } // Fixed column
        public Dictionary<string, decimal> MonthWiseSales { get; set; } = new Dictionary<string, decimal>(); // Dynamic columns
        public decimal TotalSales { get; set; } // Opt

    }
}
