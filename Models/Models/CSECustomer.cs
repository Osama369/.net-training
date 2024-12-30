using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class CSECustomer
    {
        [Key]
        public int? CSECustomerID { get; set; }
        public int? CSEID { get; set; }
        public int? CstID { get; set; }
        public int? locationId { get; set; }
        public bool? Active { get; set; }

        [NotMapped]
        public string? CustomerName { get; set; }

        [NotMapped]
        public string? LocationName { get; set; }

    }
}
