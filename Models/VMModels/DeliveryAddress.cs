using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.VMModels
{
    public class DeliveryAddress
    {
        public string? Name { get; set; } = "";
        public string? Address { get; set; } = "";
        public string? Street { get; set; } = "";
        public string? City { get; set; } = "";
        public string? StateZip { get; set; } = "";

    }
}
