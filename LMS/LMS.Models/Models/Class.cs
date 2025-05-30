using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Models.Models
{
    public class Class
    {
        [Key]
        public int ClassID { get; set; }

        [Required]
        public string? ClassName { get; set; }

    }
}
