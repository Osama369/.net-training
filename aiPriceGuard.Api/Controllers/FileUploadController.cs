using aiPriceGuard.DataAccess.DataSet;
using aiPriceGuard.Models.Models;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using aiPriceGuard.Shared.Common;
using PdfSharp.Pdf;
using PdfSharp.Pdf.IO;
using Newtonsoft.Json;

namespace aiPriceGuard.Api.Controllers
{
    [Route("api/[Controller]")]
    [ApiController]
    public class FileUploadController : Controller
    {
        private readonly AMDbContext _dbContext;
        private readonly IConfiguration _config;
        public FileUploadController(AMDbContext _dbContext, IConfiguration _config)
        {
            this._dbContext = _dbContext;
            this._config = _config;
        }
        [HttpPost("UpsertFile")]
        public async Task<IActionResult> UpsertFile([FromForm]FileModel model)
        {
            if(model.file!=null && model.file.Length > 0)
            {
                string directoryPath = _config.GetSection("AppSettings:ImgPath").Value +"\\assets\\PDF";
                if (!Directory.Exists(directoryPath))
                {
                    Directory.CreateDirectory(directoryPath);
                }
                string fileExtension = Path.GetExtension(model.FileName);
                string GUIDfileName = Guid.NewGuid().ToString() + fileExtension;
                string filePath = Path.Combine(directoryPath, GUIDfileName );
                using(var fileStream= new FileStream(filePath, FileMode.Create))
                {
                    await model.file.CopyToAsync(fileStream);
                }
                
                FileModel  fileModel = new FileModel();
                fileModel = model;
                fileModel.CreatedOn = DateTime.Now;
                fileModel.FileUrl = filePath;
                fileModel.FileSize = (int)model.file.Length;
                fileModel.MimeType = model.FileType;
                fileModel.FileType = model.FileType.Split('/')[1];
                fileModel.CreatedBy = User.FindFirst(ClaimTypes.Email)?.Value;
                fileModel.Status = "Process";
                fileModel.FileName = model.FileName;

                using (var pdfDoc = PdfReader.Open(filePath, PdfDocumentOpenMode.Import))
                {
                    fileModel.NoOfPages = pdfDoc.PageCount;
                }
                try
                {
                    await  _dbContext.File.AddAsync(fileModel);
                    await _dbContext.SaveChangesAsync();

                    SupplierFile suppFile = new SupplierFile
                    {
                        SupplierId = model.supplierID,
                        FileId = fileModel.FileId
                    };
                    await _dbContext.SupplierFile.AddAsync(suppFile);
                    await _dbContext.SaveChangesAsync();
                   
                }
                catch (Exception ex)
                {
                    return BadRequest(ex.Message);
                }
                return Ok(fileModel);
            }

            return BadRequest();
        }
        [HttpGet("GetAllFiles/{comID}")]
        public async Task<IActionResult> GetALLFile(int comID)
        {
            var fileList =(from filetble in _dbContext.File
                           join suppFile in _dbContext.SupplierFile
                           on filetble.FileId equals suppFile.FileId
                           join supplier in _dbContext.Supplier
                           on suppFile.SupplierId equals supplier.SupplierId
                           where filetble.comID == filetble.comID
                           select new FileModel
                           {
                               FileId = filetble.FileId,
                               FileName =filetble.FileName,
                               FileSize = filetble.FileSize,
                               FileType = filetble.FileType,
                               FileUrl = filetble.FileUrl,
                               MimeType = filetble.MimeType,
                               comID = filetble.comID,
                               Status = filetble.Status,
                               supplierName = supplier.SupplierName
                           }).ToList();
            //var fileList = _dbContext.File.Where(x=> x.comID == comID).ToList();
            var res = new ResponsedGroupListVM();
            res.enttityDataSource = fileList;
            res.entityModel = fileList?.GetEntity_MetaData();
            return Ok(res);
        }
        [HttpGet("ProcessFile/{fileID}/{comID}")]
        public async Task<IActionResult> ProcessFile(int fileID,int comID)
        {
            
            if(comID != 0 && fileID != 0)
            {
                //var FileDetails = await  _dbContext.File.FindAsync(fileID);
                try
                {
                    //Temp
                    string jsonFilePath = _config.GetSection("AppSettings:ImgPath").Value + "\\assets\\JsonFiles\\InvoiceJson.txt";
                    string jsonString = System.IO.File.ReadAllText(jsonFilePath);
                    Invoice invoiceModel = JsonConvert.DeserializeObject<Invoice>(jsonString);
                }catch (Exception ex)
                {

                }
                int x=0;
            }
            return Ok();
        }
    }
}
