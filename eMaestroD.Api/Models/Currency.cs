using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class Currency
    {
        [Key]
        public int Id { get; set; }
        public string? Name { get; set; }
        public string? CurrencyCode { get; set; }
    }
}
