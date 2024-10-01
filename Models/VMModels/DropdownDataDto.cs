using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;

namespace eMaestroD.Models.VMModels
{
    public class DropdownDataDto
    {
        public List<ProdGroups> ProductGroups { get; set; }
        public List<Department> Department { get; set; }
        public List<ProdManufacture> ProdManufacture { get; set; }
        public List<Category> Category { get; set; }
        public List<Offer> Offer { get; set; }
    }
}
