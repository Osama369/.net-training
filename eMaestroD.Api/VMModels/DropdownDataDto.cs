using eMaestroD.Api.Models;

namespace eMaestroD.Api.VMModels
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
