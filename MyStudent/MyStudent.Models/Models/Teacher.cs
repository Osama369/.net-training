using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Models.Models
{
    internal class Teacher
    {
        public int TeacherID {get;set;}

        public string? TeacherName { get;set;}

        public int? ClassID { get; set; } // FK
        public Class? Classes { get; set; }

        public int? CourseID { get; set; }  // FK
        public Course? Courses { get; set; }


    }
}
