using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Models.Models
{
    public class StudentCourse
    {
        [Key]
        public int StudentCourseID { get; set; }

        public int StudentID { get; set; }
        public int CourseID { get; set; }
    }
}
