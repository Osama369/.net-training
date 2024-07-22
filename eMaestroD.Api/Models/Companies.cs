using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class Companies
    {
        [Key]
        public int comID { get; set; }
        public string? companyName { get; set; }
        public string? softwareVersion { get; set; }
        public string? address { get; set; }
        public string? productionType { get; set; }
        public string? contactNo { get; set; }
        public string? CurrencyCode { get; set; }
        public string? printView { get; set; }
        public string? theme { get; set; }
        public string? owner { get; set; }
        public string? email { get; set; }
        public string? phone { get; set; }
        public string? country { get; set; }
        public string? state { get; set; }
        public bool? active { get; set; }
        public bool? isMultiPayment { get; set; }
        public string? city { get; set; }
        public string? language { get; set; }
        public string? crtBy { get; set; }
        public DateTime? crtDate { get; set; }
        public string? modBy { get; set; }
        public DateTime? modDate { get; set; }
        public int? timeZoneID { get; set; }
        [NotMapped]
        public decimal? taxPercentage { get; set; }
        [NotMapped]
        public string? taxName { get; set; }
        [NotMapped]
        public int taxID { get; set; }
        [NotMapped]
        public string? logoFile { get; set; }

        [NotMapped]
        public string? CurrencyName { get; set; }

        [NotMapped]
        public string? timeZone { get; set; }

    }
}
