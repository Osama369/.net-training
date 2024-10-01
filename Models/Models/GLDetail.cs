using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class GLDetail
    {
        [Key]
        public int GLDetailID { get; set; }
        public int? GLID { get; set; }
        public string? acctNo { get; set; }
        public decimal? GLAmount { get; set; }
        public decimal? rate { get; set; }
    }
}
