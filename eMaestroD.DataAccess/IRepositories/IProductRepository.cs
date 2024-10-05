using Models.VMModels;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace eMaestroD.DataAccess.IRepositories
{
    public interface IProductRepository
    {
        Task<List<ProductViewModel>> GetProducts(int comID, int prodBCID = 0);
    }
}
