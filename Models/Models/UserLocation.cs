using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class UserLocation
    {
        [Key]
        public int userLocID { get; set; }
        public int userID { get; set; }
        public int locID { get; set; }
    }
}
