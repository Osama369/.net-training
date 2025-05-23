using aiPriceGuard.Api.Services.Interfaces;
using aiPriceGuard.DataAccess.IRepositories;
using aiPriceGuard.Models.Models;
using aiPriceGuard.Models.VMModels;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using PdfSharp.Pdf.IO;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;

namespace aiPriceGuard.Api.Services.Services
{
    public class FileUploadService : IFileUploadService
    {
        private readonly IFileUploadRepository _fileUploadRepository;
        private readonly IConfiguration _config;
        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly ISupplierFileRepository _supplierFileRepository;
        private readonly ISupplierRepository _supplierRepository;


        public FileUploadService(IFileUploadRepository _fileUploadRepository,IConfiguration _config, IHttpContextAccessor _httpContextAccessor
            , ISupplierFileRepository _supplierFileRepository, ISupplierRepository _supplierRepository)
        {
            this._fileUploadRepository = _fileUploadRepository;
            this._config = _config;
            this._httpContextAccessor = _httpContextAccessor;
            this._supplierFileRepository = _supplierFileRepository;
            this._supplierRepository = _supplierRepository;
        }

        public async Task<FileModel> AddFile(FileModel model)
        {
            string directoryPath = _config.GetSection("AppSettings:ImgPath").Value + "\\assets\\PDF";
            if (!Directory.Exists(directoryPath))
            {
                Directory.CreateDirectory(directoryPath);
            }
           
            string fileExtension = Path.GetExtension(model.FileName);
            string GUIDfileName = Guid.NewGuid().ToString() + fileExtension;
            string filePath = Path.Combine(directoryPath, GUIDfileName);
            using (var fileStream = new FileStream(filePath, FileMode.Create))
            {
                await model.file.CopyToAsync(fileStream);
            }

            FileModel fileModel = new FileModel();
            fileModel = model;
            fileModel.CreatedOn = DateTime.Now;
            fileModel.FileUrl = filePath;
            fileModel.FileSize = (int)model.file.Length;
            fileModel.MimeType = model.FileType;
            fileModel.FileType = model.FileType.Split('/')[1];
            var user = _httpContextAccessor.HttpContext?.User;
            fileModel.CreatedBy = user.FindFirst(ClaimTypes.Email)?.Value;
            fileModel.Status = "Process";
            fileModel.FileName = model.FileName;

            using (var pdfDoc = PdfReader.Open(filePath, PdfDocumentOpenMode.Import))
            {
                fileModel.NoOfPages = pdfDoc.PageCount;
            }
            try
            {
                await _fileUploadRepository.AddAsync(fileModel);
               
               

                SupplierFile suppFile = new SupplierFile
                {
                    SupplierId = model.supplierID,
                    FileId = fileModel.FileId
                };
                await _supplierFileRepository.AddAsync(suppFile);
                await _supplierFileRepository.SaveChangesAsync();

            }
            catch (Exception ex)
            {
                
            }
            
            return fileModel;
        }

        public List<FileModel> GetAllFileWithSupplier(int? id)
        {
            var modelList = new List<FileModel>();
            if (id != null)
            {
                modelList =_fileUploadRepository.GetAllFileWithSupplier(id);
                return modelList;
            }
            return modelList;
        }

        //public async Task<RenderJson> GetRenderFormatData(InvoicePDF invoice,int supplierID,int comID)
        //{
        //    RenderJson renderJsonObj = new RenderJson();
        //    if (invoice != null)
        //    {
               
        //        var supplier =await _supplierRepository.FindByIdAsync(supplierID); 
        //        if (supplier != null)
        //        {
        //            renderJsonObj.SupplierName = supplier.SupplierName;
        //            renderJsonObj.OrderDate = invoice.InvoiceDetails.OrderDate;
        //            renderJsonObj.OrderNo = invoice.InvoiceDetails.OrderNo;

        //        }
        //        if (invoice.InvoiceDetails.Summary != null && invoice.InvoiceDetails.Summary.Count > 0)
        //        {
        //            renderJsonObj.ProductDetails = await MappedProductDetails(invoice.InvoiceDetails.Summary);
        //        }
        //        else if (invoice.InvoiceDetails.LineItems != null && invoice.InvoiceDetails.LineItems.Count > 0)
        //        {
        //            renderJsonObj.ProductDetails = await MappedProductDetails(invoice.InvoiceDetails.LineItems);
        //        }
        //        else if (invoice.InvoiceDetails.Items != null && invoice.InvoiceDetails.Items.Count > 0)
        //        {
        //            renderJsonObj.ProductDetails = await MappedProductDetails(invoice.InvoiceDetails.Items);
        //        }
        //        return renderJsonObj;
        //    }
        //    return null;
        //}

      

    }
}
