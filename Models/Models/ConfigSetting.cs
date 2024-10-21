using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class ConfigSetting
    {
        [Key]
        public int configID { get; set; }
        public string? key { get; set; }
        public bool? value { get; set; }
        public int comID { get; set; }
    }
}
