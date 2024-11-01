using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.Models.Models
{
    public class TransactionLog
    {
        [Key]
        public int transactionLogId { get; set; } 
        public string? voucherNo { get; set; } 
        public int? txTypeID { get; set; }
        public string? note { get; set; } 
        public string? prevStatus { get; set; } 
        public string? updatedStatus { get; set; } 
        public string? crtBy { get; set; } 
        public DateTime? crtDate { get; set; } 
        public string? modBy { get; set; } 
        public DateTime? modDate { get; set; } 
    }
}
