using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Models.Models
{
   
        public class StudentCourse
        {
        [Key]
        public int StudentCourseID { get; set; }  // primary key
        public int? StudentID { get; set; }
        public int? CourseID { get; set; }

        // Optional navigation (not required for manual handling)
        public Student? Student { get; set; }
        public Course? Course { get; set; }
    }
    
}
