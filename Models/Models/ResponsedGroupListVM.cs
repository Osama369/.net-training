using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class ResponsedGroupListVM
    {
        public IEnumerable<EntityModelVM>? entityModel { get; set; }
        public dynamic? enttityDataSource { get; set; }
    }
}
