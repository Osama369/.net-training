using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Models.Models
{
    public class Course
    {
        [Key]
        public int CourseID { get; set; }
        public string? CourseTitle { get; set; }
        public string? CourseDescription { get; set; }
    }
}
