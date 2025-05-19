namespace Studentproject.Models
{
    public class Enrollment
    {
        public int Id { get; set; }
        public Student student { get; set; }
        public int CourseId { get; set; }
        public Course course { get; set; }
        public DateTime EnrollmentDate { get; set; }
    }
}
