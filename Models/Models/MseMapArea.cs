using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class MseMapArea
    {
        [Key]
        public int MseMapID { get; set; }
        public int mseID { get; set; }
        public int AreaID { get; set; }
        public bool Active { get; set; }
        [NotMapped]
        public string? LocationName { get; set; }
        
    }
}
