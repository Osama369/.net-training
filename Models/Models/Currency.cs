using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class Currency
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? CurrencyCode { get; set; }
    }
}
