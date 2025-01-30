using System.ComponentModel.DataAnnotations;

namespace aiPriceGuard.Models.Models
{
    public class EmailTemplates
    {

        [Key]
        public int EmailTemplateID { get; set; }
        public string? EmailTemplateName { get; set; }
        public string? Body { get; set; }
        public string? Subject { get; set; }
        public DateTime? created { get; set; }
        public DateTime? updated { get; set; }

    }
}
