using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.VMModels
{
    public class UserDetailsViewModel
    {
        [Key]
        public int UserID { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public string? Mobile { get; set; }
        public string? Email { get; set; }
        public string? UserName { get; set; }
        public int? RoleID { get; set; }
        public string? RoleName { get; set; }
        public bool? active { get; set; }
        public string? Companies { get; set; }
        public string? CompaniesID { get; set; }
        public int? locID { get; set; }
        public string? locations { get; set; }
        public bool? isAllowLogin { get; set; }
    }
}
