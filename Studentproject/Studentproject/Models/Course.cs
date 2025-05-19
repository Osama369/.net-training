using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Studentproject.Models
{
    public class Course
    {
        [Key]
        public int Id { get; set; }
        public string? Title { get; set; } 
        public string? Description { get; set; }
        [NotMapped]
        public List<Enrollment>? Enrollments { get; set; }  //in which course which student is enrolled 
    }
}
