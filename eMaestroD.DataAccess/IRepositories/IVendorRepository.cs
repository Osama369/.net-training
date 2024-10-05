using eMaestroD.Models.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.IRepositories
{
    public interface IVendorRepository
    {
        Task<Vendors> GetVendorByIdAsync(int vendorId);
    }
}
