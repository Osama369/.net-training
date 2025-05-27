using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Models.Models
{
    public class Course
    {
        [Key]
        public int CourseID{ get; set; }
        public string? CourseTile { get; set; }
        public string? CourseDescription { get; set; }

       

        [NotMapped]
        public List<Student>? Students { get; set; }
    }
}
