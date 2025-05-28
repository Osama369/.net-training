using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Models.Models
{
    public class Student
    {
        public int StudentID { get; set; }
        public string StudentName { get; set; }
        public string RollNumber { get; set; }
        // FK of classID
        public int? ClassID { get; set; } // FK for class 
        // these fileds not be in database 

        public int? CourseID { get; set; }  // FK for course

        public Class? Classes { get; set; } 
        
        public Course? Courses { get; set; }

        // ✅ New: Navigation to multiple courses through StudentCourse
        [NotMapped]
        public List<int>? SelectedCourseIds { get; set; } // For view binding


        [NotMapped]
        public List<Course>? Course { get; set; }


    }
}
