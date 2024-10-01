using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class invoiceNo
    {
        [Key]
        public string? voucherNo { get; set; }
        [NotMapped]
        public int? prodID { get; set; }

    }
}
