using aiPriceGuard.Models.Custom;
using Microsoft.AspNetCore.Http;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class FileModel:IEntityBase
    {
        [Key]
        [HiddenOnRender]
        public int? FileId { get; set; } // IDENTITY(1,1) NOT NULL db
        [NotMapped]
        public string? supplierName { get; set; } // datetime NOT NULL db
        public string? FileName { get; set; } // varchar(120) NOT NULL db
        [HiddenOnRender]
        public string? FileUrl { get; set; } // varchar(500) NOT NULL db
        public string? FileType { get; set; } // varchar(3) NOT NULL db
        [HiddenOnRender]
        public string? MimeType { get; set; } = ""; // varchar(20) NULL db
        [HiddenOnRender]
        public int? FileSize { get; set; } = 0; // int NOT NULL db
        [HiddenOnRender]
        public int? NoOfPages { get; set; } = 0; // int NOT NULL db
        [HiddenOnRender]
        public bool? IsActive { get; set; } = true; // bit NOT NULL db
        [HiddenOnRender]
        public DateTime? CreatedOn { get; set; } // datetime NOT NULL db
        [HiddenOnRender]
        public string? CreatedBy { get; set; } // nchar(10) NOT NULL db
        [HiddenOnRender]
        public int? comID { get; set; } // nchar(10) NOT NULL db
        [Btn]
        public string? Status { get; set; }
        [NotMapped]
        [HiddenOnRender]
        public IFormFile file { get; set; } // datetime NOT NULL db
        [NotMapped]
        [HiddenOnRender]
        public int supplierID { get; set; } // datetime NOT NULL db
      
    }
}
