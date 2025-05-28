using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace MyStudent.Models.Models
{
    public class Class
    {
        [Key]
        public int ClassID { get; set; }

        [Required(ErrorMessage = "Class name is required")]
        [StringLength(100)]
        public string? ClassName { get; set; }

        // list of students
     //   [NotMapped]
      //  public List<Student>? Students { get; set; }

    }
}
