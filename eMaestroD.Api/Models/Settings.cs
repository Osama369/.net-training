using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Api.Models
{
    public class Settings
    {
        [Key]
        public int settingID { get; set; }
        public string? settingKey { get; set; }
        public string? settingValue { get; set; }
        public string? type { get; set; }
        public bool? active { get; set; }
        public DateTime? created { get; set; }
        public string? crtBy { get; set; }
        public DateTime? updated { get; set; }
        public string? modBy { get; set; }

    }
}
