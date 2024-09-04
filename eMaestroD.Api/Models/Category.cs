using eMaestroD.Api.Common;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace eMaestroD.Api.Models
{
    public class Category : IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int categoryID { get; set; }
        [HiddenOnRender]
        public int? parentCategoryID { get; set; }
        [DisplayName(Name = "Parent Category Name")]
        [NotMapped]
        public string? parentCategoryName { get; set; }
        [DisplayName(Name = "Department Name")]
        [NotMapped]
        public string? depName { get; set; }
        [HiddenOnRender]
        public int? depID { get; set; }
        [HiddenOnRender]
        public int? comID { get; set; }
        [DisplayName(Name = "Category Name")]
        public string? categoryName { get; set; }
        [DisplayName(Name = "Description")]
        public string? descr { get; set; }
        [HiddenOnRender]
        public bool active { get; set; }
        [HiddenOnRender]
        public string? crtBy { get; set; }
        [HiddenOnRender]
        public DateTime? crtDate { get; set; }
        [HiddenOnRender]
        public string? modby { get; set; }
        [HiddenOnRender]
        public DateTime? modDate { get; set; }

    }
}
