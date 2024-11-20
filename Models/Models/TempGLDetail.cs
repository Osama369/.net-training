using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class TempGLDetail 
    {
        [Key]
        public int TempGLDetailID { get; set; }
        public int? TempGLID { get; set; }
        public string? acctNo { get; set; }
        public decimal? GLAmount { get; set; }
        public decimal? rate { get; set; }
    }
}
