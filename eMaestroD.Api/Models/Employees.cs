using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class Employees : IEntityBase
    {
        [Key]
        public string? empPin { get; set; }
        public string? empFName { get; set; }
    }
}
