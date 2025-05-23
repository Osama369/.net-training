using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Models.VMModels
{
    public class RenderJson
    {
        public DateTime? OrderDate { get; set; }
        public string? SupplierProductCode { get; set; }
        public int? SupplierId { get; set; }
        public int? SupplierFileId { get; set; }
        public string? SupplierName { get; set; }
        public string? DeliveryAddress { get; set; }
        public decimal? totalAmount { get; set; }
        public string? fileURL { get; set; }
        public string? comID { get; set; }
        public string? OrderNo { get; set; }
        public List<ProductDetail>? ProductDetails { get; set; }



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


    }
}
