using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class Roles
    {
        [Key]
        public int? RoleID { get; set; }
        public int? ParentRoleID { get; set; }
        public string? RoleName { get; set; }
        public string? Descr { get; set; }
        public bool? Active { get; set; }
        public string? CrtBy { get; set; }
        public DateTime? CrtDate { get; set; }
        public string? ModBy { get; set; }
        public DateTime? ModDate { get; set; }
    }
}
