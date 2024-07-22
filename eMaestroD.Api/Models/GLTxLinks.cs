using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace eMaestroD.Api.Models
{
    public class GLTxLinks
    {
        [Key]
        public int GLTxLinkID { get; set; }

        public int GLID { get; set; }

        public int relGLID { get; set; }

        public int COAID { get; set; }

        public int relCOAID { get; set; }

        public int txTypeID { get; set; }

        public int againstID { get; set; }

        public int prodID { get; set; }

        public decimal qty { get; set; }

        public decimal discount { get; set; }

        public decimal paidSum { get; set; }

        public decimal balAmount { get; set; }

        public decimal amount { get; set; }

        public int fiscalYear { get; set; }

        public string? prodCode { get; set; }
    }
}
