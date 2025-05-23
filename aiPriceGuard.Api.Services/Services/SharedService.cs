using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.Models.Models;
using aiPriceGuard.Shared.Common;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Services
{
    public class SharedService : ISharedService
    {
        public ResponsedGroupListVM GetDataWithcolumns(dynamic obj)
        {
                ResponsedGroupListVM vM = new ResponsedGroupListVM();
                vM.enttityDataSource = obj;
                vM.entityModel =obj?.get;
                return vM;
        }
    }
}
