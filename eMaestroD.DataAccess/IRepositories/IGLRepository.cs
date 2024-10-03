using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using eMaestroD.Models.Models;

namespace eMaestroD.DataAccess.IRepositories
{
    public interface IGLRepository
    {
        Task<List<GL>> GetGLEntriesByVoucherNoAsync(string voucherNo);
        Task<bool> UpdateGLIsConvertedAsync(string voucherNo, string convertedVoucherNo);
        Task InsertGLEntriesAsync(List<GL> glEntries);
    }
}
