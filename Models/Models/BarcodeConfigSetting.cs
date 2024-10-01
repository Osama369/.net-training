using System.ComponentModel.DataAnnotations;

namespace eMaestroD.Models.Models
{
    public class BarcodeConfigSetting
    {
        [Key]
        public int barcodeConfigID { get; set; }
        public string? key { get; set; }
        public string? value { get; set; }
    }
}
