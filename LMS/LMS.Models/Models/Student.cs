using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace LMS.Models.Models
{
    public class Student
    {
        [Key]
        public int StudentID { get; set; }
        public string? StudentName { get; set; }

        public string? RollNumber { get; set; }

        public int? ClassID { get; set; }

        public Class? Classes { get; set; }

        [NotMapped]
        public List<int>? SelectedCourseIds { get; set; }

        [NotMapped]
        public List<Course>? Course { get; set; }
    }
}
