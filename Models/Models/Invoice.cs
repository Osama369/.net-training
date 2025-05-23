using aiPriceGuard.Models.VMModels;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.Models
{
    public class Invoice
    {
        [Key]
        public int InvoiceId { get; set; }
        [NotMapped]
        public List<InvoiceDetail> LineItems { get; set; }
        [NotMapped]
        public List<InvoiceDetail> Items { get; set; }

        [NotMapped]
        public List<InvoiceDetail> Summary { get; set; }
        [NotMapped]
        public DeliveryAddress? delAddress { get; set; }
        [NotMapped]
        public List<InvoiceDetail>? ProductDetails { get; set; }
        [NotMapped]
        public Supplier? Supplier { get; set; }
        //[NotMapped]
        public string? OrderNo { get; set; }         // Nullable, varchar(15)
        public DateTime? OrderDate { get; set; }    // Nullable datetime
        public int? comID { get; set; }             // Nullable
        public int? SupplierFileId { get; set; }    // Nullable
        public int? SupplierId { get; set; }        // Nullable
        public string? InvFileUrl { get; set; }      // Nullable, varchar(500)
        public DateTime? CreatedOn { get; set; }    // Nullable datetime
        public string? CreatedBy { get; set; }       // Nullable, varchar(50)
        public decimal? InvoiceTotal { get; set; }  // Nullable decimal

        public string? Fax { get; set; }
        public string? CustomerCode { get; set; }    // Nullable, varchar(20)
        public string? DeliveryNote { get; set; }   // Nullable string
        public DateTime? DeliveryDate { get; set; } // Nullable DateTime
        public string? Tel { get; set; }         // Nullable string
        public string? Customer_Ref_No { get; set; } // Nullable string
        public string? InvNumber { get; set; }       // Nullable, varchar(20)
        public DateTime? InvDate { get; set; }           // Nullable, int (can be used for a date stored as int)
        //public DateTime? InvDate { get; set; }
        public string? PhoneNo { get; set; }         // Nullable, varchar(20)
        public string? CustomerRefNo { get; set; }   // Nullable, varchar(100)
        public string? DelNumber { get; set; }       // Nullable, varchar(15)
        public string? DelNote { get; set; }         // Nullable, varchar(50)
        public DateTime? DelDate { get; set; }      // Nullable datetime
        public string? DelAddressLine1 { get; set; } // Nullable, varchar(150)
        public string? DelAddressLine2 { get; set; } // Nullable, varchar(150)
        public string? DelAddressLine3 { get; set; } // Nullable, varchar(150)
        public string? DelSuburb { get; set; }       // Nullable, varchar(50)
        public string? DelState { get; set; }        // Nullable, varchar(10)
        public string? DelPostcode { get; set; }     // Nullable, varchar(8)
        public string? Remarks { get; set; }         // Nullable, varchar(255)
        public int? SalesOrderNo { get; set; }  // Nullable integer
        //public int? PurchOrderNo { get; set; }  // Nullable integer
        public string? Terms { get; set; }      // Nullable string
        public string? Rep { get; set; }        // Nullable string
        public DateTime? ShippedOn { get; set; } // Nullable DateTime
        public string? ShipVia { get; set; }    // Nullable string
        public string? FreightOnBoard { get; set; } // Nullable string
        public string? TotalCasesPallets { get; set; } // Nullable string
        public int? purchaseOrderNo { get; set; }
        public string? CompanyName { get; set; }  // Nullable string
        public string? DeliveryAddress { get; set; }  // Nullable string
    
      
        //[NotMapped]
        //public JObject DeliveryAddress { get; set; }


    }
}
