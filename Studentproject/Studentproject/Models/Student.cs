using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Studentproject.Models
{
    public class Student
    {
        [Key]
       
        public int Id { get; set; }
      
        public string? Name { get; set; }
        public string? RollNumber { get; set; }
       
        public string? url { get; set; }
      
        [NotMapped]
        public List<Enrollment>? Enrollments { get; set; } // which student is in enrollment
    }
}
