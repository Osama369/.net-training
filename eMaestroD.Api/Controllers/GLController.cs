using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using Microsoft.Data.SqlClient;
using System.Diagnostics;
using System.Drawing;
using System.Drawing.Imaging;
using System.Drawing.Printing;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using Microsoft.AspNetCore.Mvc.ModelBinding;
using System.Text.Json;
using System.Security.Claims;
using ClosedXML.Excel;
using eMaestroD.Api.Models;
using eMaestroD.Api.Common;
using eMaestroD.Api.Data;
using Microsoft.AspNetCore.Authorization;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]/[action]")]
    public class GLController : Controller
    {

        private readonly AMDbContext _AMDbContext;
        public static string vourcherno { get; set; } = "";
        private decimal totalQty = 0, totalDiscount = 0;
        private int taxID = 0;
        private string taxAcctNo = "";
        private string vouchnerNo = "";
        bool isGuest = false;
        List<invoiceNo> SDL;

        List<GLTxLinks> gltxLinksLstSD = new List<GLTxLinks>();
        private List<GL> glSaleDelList { get; set; }
        public List<GL> removeSaleInvoiceItemOnEdit { get; set; }
        List<GL> glPurchaseInvUpdLst { get; set; }
        List<GLTxLinks> gltxLinks { get; set; }
        List<GLTxLinks> gltxLinksUpdated { get; set; }
        List<GLTxLinks> gltxLinksDelete { get; set; }
        public List<GL> EditDelInvoice { get; set; }
        List<GLTxLinks> glOrderLnkLst { get; set; }
        public List<GL> glPurchasedInvoicesLst { get; set; }
        public List<COA> updatedCoaLst { get; set; }
        GLTxLinks gltxLnks;
        bool isEdit = false;
        int fiscalYear = 0;
        string username = "";

        private readonly IHttpContextAccessor _httpContextAccessor;
        private readonly NotificationInterceptor _notificationInterceptor; 
        private readonly HelperMethods _helperMethods; 
        private readonly GLService _gLService;
        public GLController(AMDbContext aMDbContext, NotificationInterceptor notificationInterceptor, IHttpContextAccessor httpContextAccessor, GLService gLService, HelperMethods helperMethods)
        {
            _AMDbContext = aMDbContext;
            _notificationInterceptor = notificationInterceptor;
            _httpContextAccessor = httpContextAccessor;
            _gLService = gLService;
            _helperMethods = helperMethods;
            username = GetUsername();

        }

        [NonAction]
        public string GetUsername()
        {
            var email = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.Email);
            var user = _AMDbContext.Users.Where(x => x.Email == email).FirstOrDefault();
            return user.FirstName + " " + user.LastName;
        }


        [HttpPost]
        public async Task<IActionResult> AddSaleInvoice([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }

            
            string VNO = gl[0].voucherNo;
            string newVoucherNo = "";
            if (gl[0].voucherNo == null || gl[0].glComments == "Quotation")
            {
                newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            { 
              taxID = coa.COAID;
              taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SaveSales(gl);

            if (!isEdit)
            {

                await _gLService.InsertGLEntriesAsync(list, now, username);

                foreach (var item in gltxLinksLstSD)
                {
                    item.GLID = list.Find(x => x.COAID == 141 && x.prodID == item.prodID).GLID;
                    await _AMDbContext.GLTxLinks.AddAsync(item);
                    await _AMDbContext.SaveChangesAsync();
                }

                if (gl[0].glComments == "Quotation")
                {
                    List<GL> lst = _AMDbContext.gl.Where(x => x.voucherNo == VNO).ToList();
                    foreach (var item in lst)
                    {
                        item.glComments = "Sale Invoice Created : " + newVoucherNo;
                    }
                    _AMDbContext.UpdateRange(lst);
                    await _AMDbContext.SaveChangesAsync();
                }
                _notificationInterceptor.SaveNotification("SaleInvoicesCreate", gl[0].comID, gl[0].voucherNo);
            }
            else
            {
                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "SaleInvoices",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = VNO
                };

                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                await _AMDbContext.AuditLogs.AddAsync(al);
                _AMDbContext.gl.UpdateRange(list);
                _AMDbContext.GLTxLinks.UpdateRange(gltxLinksUpdated);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("SaleInvoicesEdit", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> SaveStockAdjustment([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }

            string VNO = gl[0].voucherNo;
            string voucherNo = "";
            if (gl[0].voucherNo == null || gl[0].glComments == "Quotation")
            {
                string newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;

            List<object> objList = new List<object>();

            foreach (var item in gl)
            {
                var newObj = new
                {
                    item.voucherNo,
                    previousQty = item.bonusQty,
                    newQty = item.qty,
                    item.prodID,
                    unitprice = item.unitPrice
                };

                objList.Add(newObj);
            }

            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SaveStockEntry(gl);



            if (!isEdit)
            {
                await _gLService.InsertGLEntriesAsync(list, now, username);

                string json = JsonSerializer.Serialize(objList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "SaveStockAdjustment",
                    actionName = "Insert",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = voucherNo
                };

                await _AMDbContext.AuditLogs.AddAsync(al);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("bulkStockUpdateCreate", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> AddSaleReturn([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            string VNO = gl[0].voucherNo;
            if (gl[0].voucherNo == null)
            {
                string newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            string saleVoucherNo = gl[0].checkName;
            var glSaleList = _AMDbContext.gl.Where(x => x.voucherNo == saleVoucherNo && x.COAID == 141).ToList();
            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SaveSalesReturn(gl);

            if (!isEdit)
            {
                foreach (var item in list)
                {
                    if (glSaleList.Count == 0 && item.prodID != 0)
                    {
                        var glPurchaseList = _AMDbContext.gl.Where(x => x.prodID == item.prodID && x.COAID == 141 && x.qtyBal > 0 && x.txTypeID == 4).ToList();
                        var returnQty = item.qty;
                        foreach (var purchaseitem in glPurchaseList)
                        {
                            GLTxLinks gltxLink = new GLTxLinks()
                            {
                                relGLID = purchaseitem.GLID, //glSaleDel.GLID,
                                txTypeID = 5,
                                qty = returnQty,
                                discount = 0,
                                againstID = item.cstID,
                                COAID = item.COAID,
                                relCOAID = item.relCOAID,
                                fiscalYear = fiscalYear,
                                prodID = item.prodID,
                            };
                            gltxLinksLstSD.Add(gltxLink);


                            if (purchaseitem.qtyBal >= returnQty)
                            {
                                purchaseitem.qtyBal -= returnQty;
                                _AMDbContext.gl.Update(purchaseitem);
                                break;
                            }
                            else
                            {
                                returnQty -= purchaseitem.qtyBal;
                                purchaseitem.qtyBal = 0;
                                _AMDbContext.gl.Update(purchaseitem);
                            }
                        }
                    }
                    else if (glSaleList.FindAll(x => x.prodID == item.prodID).Count > 0)
                    {
                        var glPurchaseList = glSaleList.Find(x => x.prodID == item.prodID);
                        glPurchaseList.qtyBal -= item.qty;
                        _AMDbContext.gl.Update(glPurchaseList);

                        GLTxLinks gltxLink = new GLTxLinks()
                        {
                            relGLID = glPurchaseList.GLID, //glSaleDel.GLID,
                            txTypeID = 5,
                            qty = item.qty,
                            discount = 0,
                            againstID = item.cstID,
                            COAID = item.COAID,
                            relCOAID = item.relCOAID,
                            fiscalYear = fiscalYear,
                            prodID = item.prodID,
                        };
                        gltxLinksLstSD.Add(gltxLink);

                    }
                }

                await _gLService.InsertGLEntriesAsync(list, now, username);

                var updateBalSumList = _AMDbContext.gl.Where(x => x.voucherNo == saleVoucherNo && x.relCOAID == 141 && x.COAID == 40).FirstOrDefault();
                if (updateBalSumList != null)
                {
                    var updatedlist = list.Where(x => x.txID == 0).FirstOrDefault();
                    updateBalSumList.balSum -= updatedlist.creditSum + updatedlist.taxSum - updatedlist.discountSum;
                    _AMDbContext.gl.Update(updateBalSumList);
                    await _AMDbContext.SaveChangesAsync();
                }


                foreach (var item in gltxLinksLstSD)
                {
                    item.GLID = list.Find(x => x.txID == 0).GLID;
                    await _AMDbContext.GLTxLinks.AddAsync(item);
                    await _AMDbContext.SaveChangesAsync();
                }

                _notificationInterceptor.SaveNotification("CreditNoteCreate", gl[0].comID, gl[0].voucherNo);
            }
            else
            {

                foreach (var item in list)
                {
                    if (glSaleList.Count == 0 && item.prodID != 0)
                    {
                        var glPurchaseList = _AMDbContext.gl.Where(x => x.prodID == item.prodID && x.COAID == 141 && x.qtyBal > 0 && x.txTypeID == 4).ToList();
                        var returnQty = item.qty - glSaleDelList.Find(x => x.prodID == item.prodID).qty;
                        foreach (var purchaseitem in glPurchaseList)
                        {
                            if (returnQty > 0)
                            {
                                var glID = list.Find(x => x.txID == 0).GLID;
                                var glTxLinkList = _AMDbContext.GLTxLinks.Where(x => x.GLID == glID && x.prodID == item.prodID && x.txTypeID == 5).ToList();

                                foreach (var glTx in glTxLinkList)
                                {
                                    glTx.qty += returnQty;
                                    gltxLinksUpdated.Add(glTx);
                                }

                                if (purchaseitem.qtyBal >= returnQty)
                                {
                                    purchaseitem.qtyBal -= returnQty;
                                    _AMDbContext.gl.Update(purchaseitem);
                                    break;
                                }
                                else
                                {
                                    returnQty -= purchaseitem.qtyBal;
                                    purchaseitem.qtyBal = 0;
                                    _AMDbContext.gl.Update(purchaseitem);
                                }
                            }
                        }

                    }
                    else if (glSaleList.FindAll(x => x.prodID == item.prodID).Count > 0)
                    {
                        var glPurchaseList = glSaleList.Find(x => x.prodID == item.prodID);
                        glPurchaseList.qtyBal -= item.qty - glSaleDelList.Find(x => x.prodID == item.prodID).qty;
                        _AMDbContext.gl.Update(glPurchaseList);

                        var glID = list.Find(x => x.txID == 0).GLID;
                        var glTxLinkList = _AMDbContext.GLTxLinks.Where(x => x.GLID == glID && x.prodID == item.prodID && x.txTypeID == 5).ToList();

                        foreach (var glTx in glTxLinkList)
                        {
                            glTx.qty = item.qty;
                            gltxLinksUpdated.Add(glTx);
                        }

                    }
                }

                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "SaleReturn",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = VNO
                };

                await _AMDbContext.AuditLogs.AddAsync(al);

                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                var updateBalSumList = _AMDbContext.gl.Where(x => x.voucherNo == saleVoucherNo && x.relCOAID == 141 && x.COAID == 40).FirstOrDefault();
                if (updateBalSumList != null)
                {
                    var updatedlist = list.Where(x => x.txID == 0).FirstOrDefault();
                    var Olddlist = glSaleDelList.Find(x => x.txID == 0);
                    updateBalSumList.balSum += Olddlist.creditSum + Olddlist.taxSum - Olddlist.discountSum;
                    updateBalSumList.balSum -= updatedlist.creditSum + updatedlist.taxSum - updatedlist.discountSum;
                    _AMDbContext.gl.Update(updateBalSumList);
                }


                _AMDbContext.gl.UpdateRange(list);
                _AMDbContext.GLTxLinks.UpdateRange(gltxLinksUpdated);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("CreditNoteEdit", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> AddServiceInvoice([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            string VNO = gl[0].voucherNo;
            if (gl[0].voucherNo == null)
            {
                string newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SaveService(gl);

            if (!isEdit)
            {

                await _gLService.InsertGLEntriesAsync(list, now, username);

                _notificationInterceptor.SaveNotification("ServiceInvoicesCreate", gl[0].comID, gl[0].voucherNo);
            }
            else
            {
                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "ServiceInvoices",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = VNO
                };
                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.gl.UpdateRange(list);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("ServiceInvoicesEdit", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> AddPurchaseInvoice([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            string VNO = gl[0].voucherNo;
            string newVoucherNo = "";
            if (gl[0].voucherNo == null || gl[0].glComments == "Purchase Order")
            {
                newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SavePurchase(gl);

            if (!isEdit)
            {

                await _gLService.InsertGLEntriesAsync(list, now, username);

                if (gl[0].glComments == "Purchase Order")
                {
                    List<GL> lst = _AMDbContext.gl.Where(x => x.voucherNo == VNO).ToList();
                    foreach (var item in lst)
                    {
                        item.glComments = "Purchase Created : " + newVoucherNo;
                    }
                    _AMDbContext.UpdateRange(lst);
                    await _AMDbContext.SaveChangesAsync();
                }
                _notificationInterceptor.SaveNotification("PurchaseCreate", gl[0].comID, gl[0].voucherNo);

            }
            else
            {
                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "Purchase",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = VNO
                };
                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.gl.UpdateRange(list);
                _AMDbContext.GLTxLinks.UpdateRange(gltxLinksUpdated);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("PurchaseEdit", gl[0].comID, gl[0].voucherNo);

            }

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> AddPurchaseReturn([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            string VNO = gl[0].voucherNo;
            if (gl[0].voucherNo == null)
            {


                var newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            string purchaseVoucherNo = gl[0].checkName;
            glPurchasedInvoicesLst = _AMDbContext.gl.Where(x => x.voucherNo == purchaseVoucherNo && x.COAID == 98).ToList();
            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SavePurchaseReturn(gl);

            if (!isEdit)
            {
                foreach (var item in list)
                {
                    if (glPurchasedInvoicesLst.Count == 0 && item.prodID != 0)
                    {
                        var glPurchaseList = _AMDbContext.gl.Where(x => x.prodID == item.prodID && x.qtyBal > 0 && x.txTypeID == 1).ToList();
                        var returnQty = item.qty * -1;
                        foreach (var purchaseitem in glPurchaseList)
                        {
                            GLTxLinks gltxLink = new GLTxLinks()
                            {
                                relGLID = purchaseitem.GLID, //glSaleDel.GLID,
                                txTypeID = 2,
                                qty = returnQty,
                                discount = 0,
                                againstID = item.vendID,
                                COAID = item.COAID,
                                relCOAID = item.relCOAID,
                                fiscalYear = fiscalYear,
                                prodID = item.prodID,
                            };
                            gltxLinksLstSD.Add(gltxLink);

                            if (purchaseitem.qtyBal >= returnQty)
                            {
                                purchaseitem.qtyBal -= returnQty;
                                _AMDbContext.gl.Update(purchaseitem);
                                break;
                            }
                            else
                            {
                                returnQty -= purchaseitem.qtyBal;
                                purchaseitem.qtyBal = 0;
                                _AMDbContext.gl.Update(purchaseitem);
                            }
                        }

                    }
                    else if (glPurchasedInvoicesLst.FindAll(x => x.prodID == item.prodID).Count > 0)
                    {
                        var glPurchaseList = glPurchasedInvoicesLst.Find(x => x.prodID == item.prodID);
                        glPurchaseList.qtyBal += item.qty;
                        _AMDbContext.gl.Update(glPurchaseList);

                        GLTxLinks gltxLink = new GLTxLinks()
                        {
                            relGLID = glPurchaseList.GLID, //glSaleDel.GLID,
                            txTypeID = 2,
                            qty = item.qty * -1,
                            discount = 0,
                            againstID = item.vendID,
                            COAID = item.COAID,
                            relCOAID = item.relCOAID,
                            fiscalYear = fiscalYear,
                            prodID = item.prodID,
                        };
                        gltxLinksLstSD.Add(gltxLink);
                    }
                }

                await _gLService.InsertGLEntriesAsync(list, now, username);

                var updateBalSumList = _AMDbContext.gl.Where(x => x.voucherNo == purchaseVoucherNo && x.relCOAID == 98 && x.balSum > 0).FirstOrDefault();
                if (updateBalSumList != null)
                {
                    var updatedlist = list.Where(x => x.txID == 0).FirstOrDefault();
                    updateBalSumList.balSum -= updatedlist.creditSum + updatedlist.taxSum - updatedlist.discountSum;
                    _AMDbContext.gl.Update(updateBalSumList);
                    await _AMDbContext.SaveChangesAsync();
                }



                foreach (var item in gltxLinksLstSD)
                {
                    item.GLID = list.Find(x => x.txID == 0).GLID;
                    await _AMDbContext.GLTxLinks.AddAsync(item);
                    await _AMDbContext.SaveChangesAsync();
                }

                _notificationInterceptor.SaveNotification("DebitNoteCreate", gl[0].comID, gl[0].voucherNo);
            }
            else
            {


                foreach (var item in list)
                {
                    if (glPurchasedInvoicesLst.Count == 0 && item.prodID != 0)
                    {
                        var glPurchaseList = _AMDbContext.gl.Where(x => x.prodID == item.prodID && x.qtyBal > 0 && x.txTypeID == 1).ToList();
                        var returnQty = item.qty * -1 - glSaleDelList.Find(x => x.prodID == item.prodID).qty;
                        foreach (var purchaseitem in glPurchaseList)
                        {
                            var glID = list.Find(x => x.txID == 0).GLID;
                            var glTxLinkList = _AMDbContext.GLTxLinks.Where(x => x.GLID == glID && x.prodID == item.prodID && x.txTypeID == 2).ToList();
                            foreach (var glTx in glTxLinkList)
                            {
                                glTx.qty += returnQty;
                                gltxLinksUpdated.Add(glTx);
                            }


                            if (purchaseitem.qtyBal >= returnQty)
                            {
                                purchaseitem.qtyBal -= returnQty;
                                _AMDbContext.gl.Update(purchaseitem);
                                break;
                            }
                            else
                            {
                                returnQty -= purchaseitem.qtyBal;
                                purchaseitem.qtyBal = 0;
                                _AMDbContext.gl.Update(purchaseitem);
                            }
                        }

                    }
                    else if (glPurchasedInvoicesLst.FindAll(x => x.prodID == item.prodID).Count > 0)
                    {
                        var glPurchaseList = glPurchasedInvoicesLst.Find(x => x.prodID == item.prodID);
                        glPurchaseList.qtyBal += item.qty - glSaleDelList.Find(x => x.prodID == item.prodID).qty;
                        _AMDbContext.gl.Update(glPurchaseList);

                        var glID = list.Find(x => x.txID == 0).GLID;
                        var glTxLinkList = _AMDbContext.GLTxLinks.Where(x => x.GLID == glID && x.prodID == item.prodID && x.txTypeID == 2).ToList();

                        foreach (var glTx in glTxLinkList)
                        {
                            glTx.qty = item.qty * -1;
                            gltxLinksUpdated.Add(glTx);
                        }
                    }
                }

                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "PurchaseReturn",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = VNO
                };

                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                await _AMDbContext.AuditLogs.AddAsync(al);

                var checkCredit = _AMDbContext.gl.Where(x => x.voucherNo == purchaseVoucherNo && x.txID == 0 && x.balSum > 0).FirstOrDefault();
                if (checkCredit != null)
                {
                    var updateBalSumList = _AMDbContext.gl.Where(x => x.voucherNo == purchaseVoucherNo && x.relCOAID == 98).FirstOrDefault();
                    if (updateBalSumList != null)
                    {
                        var updatedlist = list.Where(x => x.txID == 0).FirstOrDefault();
                        var Olddlist = glSaleDelList.Find(x => x.txID == 0);
                        updateBalSumList.balSum += Olddlist.creditSum + Olddlist.taxSum - Olddlist.discountSum;
                        updateBalSumList.balSum -= updatedlist.creditSum + updatedlist.taxSum - updatedlist.discountSum;

                        _AMDbContext.gl.Update(updateBalSumList);
                    }
                }
                _AMDbContext.gl.UpdateRange(list);
                _AMDbContext.GLTxLinks.UpdateRange(gltxLinksUpdated);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("DebitNoteEdit", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(list);
        }

        [HttpPost]
        public async Task<IActionResult> AddQuotationInvoice([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            if (gl[0].voucherNo == null)
            {
                string newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            //var date = new DateTime(now.Year, now.Month, now.Day,
            //                        now.Hour, now.Minute,
            //                        now.Second);
            //var dt = new DateTime(gl[0].dtTx.Year, gl[0].dtTx.Month, gl[0].dtTx.Day,
            //                        now.Hour, now.Minute,
            //                        now.Second);

            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SaveQutation(gl);
            if (!isEdit)
            {
                await _gLService.InsertGLEntriesAsync(list, now, username);

                _notificationInterceptor.SaveNotification("QuotationsCreate", gl[0].comID, gl[0].voucherNo);
            }
            else
            {
                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "Quotations",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = gl[0].voucherNo
                };

                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.gl.UpdateRange(list);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("QuotationsEdit", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(gl);
        }

        [HttpPost]
        public async Task<IActionResult> AddPurchaseOrder([FromBody] List<GL> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            if (gl[0].voucherNo == null)
            {
                string newVoucherNo = await _helperMethods.GenerateVoucherNoAsync(gl[0].txTypeID, gl[0].comID);
                if (string.IsNullOrEmpty(newVoucherNo))
                {
                    return NotFound();
                }

                foreach (var item in gl)
                {
                    item.voucherNo = newVoucherNo;
                }
            }
            else
            {
                isEdit = true;
                isGuest = true;
            }
            var coa = _AMDbContext.COA.Where(x => x.acctName == gl[0].taxName && x.comID == gl[0].comID).FirstOrDefault();
            if (coa == null)
            {
            }
            else
            {
                taxID = coa.COAID;
                taxAcctNo = coa.acctNo;
            }

            var now = DateTime.Now;
            //var date = new DateTime(now.Year, now.Month, now.Day,
            //                        now.Hour, now.Minute,
            //                        now.Second);
            //var dt = new DateTime(gl[0].dtTx.Year, gl[0].dtTx.Month, gl[0].dtTx.Day,
            //                        now.Hour, now.Minute,
            //                        now.Second);

            glSaleDelList = _AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList();
            List<GL> list = SavePurchaseOrder(gl);
            if (!isEdit)
            {
                await _gLService.InsertGLEntriesAsync(list, now, username);

                _notificationInterceptor.SaveNotification("PurchaseOrderCreate", gl[0].comID, gl[0].voucherNo);
            }
            else
            {
                string json = JsonSerializer.Serialize(glSaleDelList);
                AuditLogs al = new AuditLogs()
                {
                    methodName = "PurchaseOrder",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = gl[0].voucherNo
                };

                foreach (var item in list)
                {
                    item.modDate = now;
                    item.modBy = username;
                }

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.gl.UpdateRange(list);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("PurchaseOrderEdit", gl[0].comID, gl[0].voucherNo);
            }

            return Ok(gl);
        }

        [HttpPost]
        public async Task<IActionResult> saveReceiptVoucher([FromBody] List<invoices> gl)
        {


            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            var COAID = gl[0].COAID;
            
            var acctNo = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);
            var relAcctNo = gl[0].acctNo;
            if (COAID == 80)
            {
                var cashInHandAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
                relAcctNo = cashInHandAccCode;
            }
            
            var cstID = gl[0].cstID;
            var comID = gl[0].comID;
            var glid = gl[0].GLID;
            string glComments = gl[0].glComments;
            DateTime dtTx = gl[0].dtTx;
            decimal total = 0;
            List<GL> gllist = new List<GL>();
            var now = DateTime.Now;

            if (gl[0].GLID == 0)
            {
                gl.RemoveAll(x => x.enterAmount == 0);

                foreach (var item in gl)
                {
                    var list = _AMDbContext.gl.Where(x => x.voucherNo == item.voucherNo && x.txID != 0 && x.cstID == cstID && x.balSum > 0).ToList();
                    if (list.Count > 0)
                    {
                        total += item.enterAmount;
                        list[0].balSum = list[0].balSum - item.enterAmount;
                        _AMDbContext.UpdateRange(list);

                        GLTxLinks gltxLink = new GLTxLinks()
                        {
                            relGLID = list[0].GLID, //glSaleDel.GLID,
                            txTypeID = 6,
                            amount = item.enterAmount,
                            discount = 0,
                            againstID = cstID,
                            COAID = COAID,
                            relCOAID = 40,
                            fiscalYear = fiscalYear,
                            prodID = 0,
                            prodCode = ""
                        };
                        gltxLinksLstSD.Add(gltxLink);
                    }
                }
                await _AMDbContext.SaveChangesAsync();


                string sql = "EXEC GenerateVoucherNo @txType, @comID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@txType", Value = 6 },
                    new SqlParameter { ParameterName = "@comID", Value = gl[0].comID }
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;


                GL glEntry = new GL()
                {
                    voucherNo = voucherNo,
                    cstID = cstID,
                    COAID = 40,
                    txTypeID = 6,
                    relCOAID = COAID,
                    depositID = fiscalYear,
                    dtTx = dtTx,
                    crtDate = now,
                    modDate = now,
                    creditSum = total,
                    glComments = glComments,
                    comID = comID,
                    acctNo = acctNo,
                    relAcctNo = relAcctNo

                };

                gllist.Add(glEntry);

                List<COA> coaList = _AMDbContext.COA.Where(x => x.COANo == cstID && x.parentCOAID == 40).ToList();
                if (coaList.Any())
                {
                    COA firstCOA = coaList.First();
                    firstCOA.bal -= total; // Subtract 'total' from the 'bal' property of the first COA
                    _AMDbContext.Update(firstCOA);
                    await _AMDbContext.SaveChangesAsync(); // Save changes to the database
                }
            }
            else
            {
                decimal oldtotal = 0;
                foreach (var item in gl)
                {
                    var list = _AMDbContext.gl.Where(x => x.voucherNo == item.voucherNo && x.txID != 0 && x.cstID == cstID).ToList();
                    foreach (var glOldlist in list)
                    {
                        var glTxList = _AMDbContext.GLTxLinks.Where(x => x.relGLID == glOldlist.GLID && x.GLID == glid).ToList();
                        if (glTxList.Count > 0)
                        {
                            total += item.enterAmount;
                            oldtotal += glTxList[0].amount;
                            glOldlist.balSum = glOldlist.balSum + glTxList[0].amount - item.enterAmount;
                            _AMDbContext.gl.UpdateRange(glOldlist);
                            await _AMDbContext.SaveChangesAsync();

                            glTxList[0].COAID = COAID;
                            glTxList[0].amount = item.enterAmount;
                            gltxLinksLstSD.Add(glTxList[0]);
                        }
                    }
                }


                var glist = _AMDbContext.gl.Where(x => x.GLID == glid).ToList();

                GL glEntry = new GL()
                {
                    voucherNo = glist[0].voucherNo,
                    cstID = cstID,
                    COAID = 40,
                    txTypeID = 6,
                    relCOAID = COAID,
                    depositID = fiscalYear,
                    dtTx = dtTx,
                    crtDate = glist[0].crtDate,
                    modDate = now,
                    creditSum = total,
                    glComments = glComments,
                    comID = comID,
                    acctBal = glist[0].creditSum,
                    GLID = glist[0].GLID,
                    acctNo = acctNo,
                    relAcctNo = relAcctNo
                };

                gllist.Add(glEntry);


                isEdit = true;
            }




            List<GL> lst = SaveReceipt(gllist);
            if (!isEdit)
            {
                await _gLService.InsertGLEntriesAsync(lst, now, username);
                foreach (var item in gltxLinksLstSD)
                {
                    item.GLID = lst.Find(x => x.txID == 0).GLID;
                    await _AMDbContext.GLTxLinks.AddAsync(item);
                    await _AMDbContext.SaveChangesAsync();
                }

                _notificationInterceptor.SaveNotification("ReceiptVoucherCreate", gl[0].comID, gllist[0].voucherNo);
            }
            else
            {
                string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == gllist[0].voucherNo).ToList());
                AuditLogs al = new AuditLogs()
                {
                    methodName = "ReceiptVoucher",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = gllist[0].voucherNo
                };

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.gl.UpdateRange(lst);
                _AMDbContext.GLTxLinks.UpdateRange(gltxLinksLstSD);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("ReceiptVoucherEdit", gl[0].comID, gllist[0].voucherNo);
            }

            return Ok(gl);
        }

        [HttpPost]
        public async Task<IActionResult> saveJournalVoucher([FromBody] List<journalVoucher> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            string glComments = gl[0].glComments;
            DateTime dtTx = gl[0].dtTx;
            decimal total = 0;
            int comID = gl[0].comID;
            List<GL> glEntry = new List<GL>();
            var now = DateTime.Now;

            if (gl[0].GLID == 0)
            {

                string sql = "EXEC GenerateVoucherNo @txType, @comID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@txType", Value = 8 },
                    new SqlParameter { ParameterName = "@comID", Value = gl[0].comID }
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;


                foreach (var item in gl)
                {

                    glEntry.Add(new GL
                    {
                        voucherNo = voucherNo,
                        cstID = 0,
                        COAID = item.COAID,
                        txTypeID = 8,
                        relCOAID = item.parentCOAID,
                        depositID = fiscalYear,
                        dtTx = dtTx,
                        crtDate = now,
                        modDate = now,
                        creditSum = item.credit,
                        debitSum = item.debit,
                        glComments = glComments,
                        comID = comID,
                        acctNo = item.acctNo,
                        relAcctNo = item.relAcctNo
                    });
                }

            }
            else
            {

                var txID = _AMDbContext.gl.Where(x => x.GLID == gl[0].GLID).ToList()[0].txID;
                var glOldList = _AMDbContext.gl.Where(x => x.txID == txID).ToList();


                foreach (var item in gl)
                {

                    glEntry.Add(new GL
                    {
                        voucherNo = glOldList[0].voucherNo,
                        cstID = 0,
                        COAID = item.COAID,
                        txTypeID = 8,
                        relCOAID = item.parentCOAID,
                        depositID = fiscalYear,
                        dtTx = dtTx,
                        crtDate = now,
                        modDate = now,
                        creditSum = item.credit,
                        debitSum = item.debit,
                        glComments = glComments,
                        comID = comID,
                        acctNo = item.acctNo,
                        relAcctNo = item.relAcctNo
                    });
                }



                string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList());
                AuditLogs al = new AuditLogs()
                {
                    methodName = "JournalVoucher",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = gl[0].voucherNo
                };

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.voucherNo == glOldList[0].voucherNo));
                await _AMDbContext.SaveChangesAsync();


                isEdit = true;

            }
            List<GL> lst = SaveJournal(glEntry);
            await _gLService.InsertGLEntriesAsync(lst, now, username);
            foreach (var item in gltxLinksLstSD)
            {
                item.GLID = lst.Find(x => x.txID == 0).GLID;
                await _AMDbContext.GLTxLinks.AddAsync(item);
                await _AMDbContext.SaveChangesAsync();
            }

            if (isEdit)
            {
                _notificationInterceptor.SaveNotification("JournalVoucherEdit", gl[0].comID, lst[0].voucherNo);
            }
            else
            {
                _notificationInterceptor.SaveNotification("JournalVoucherCreate", gl[0].comID, lst[0].voucherNo);
            }

            return Ok(gl);
        }

        [HttpPost]
        public async Task<IActionResult> SaveExpenseVoucher([FromBody] List<journalVoucher> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            string glComments = gl[0].masterEntryComment;
            DateTime dtTx = gl[0].dtTx;
            decimal total = 0;
            int comID = gl[0].comID;
            List<GL> glEntry = new List<GL>();
            var now = DateTime.Now;

            if (gl[0].GLID == 0)
            {

                string sql = "EXEC GenerateVoucherNo @txType, @comID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                    new SqlParameter { ParameterName = "@txType", Value = 42 },
                    new SqlParameter { ParameterName = "@comID", Value = gl[0].comID }
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;


                foreach (var item in gl)
                {

                    glEntry.Add(new GL
                    {
                        voucherNo = voucherNo,
                        cstID = 0,
                        COAID = item.COAID,
                        txTypeID = 42,
                        relCOAID = item.parentCOAID,
                        depositID = fiscalYear,
                        dtTx = dtTx,
                        crtDate = now,
                        modDate = now,
                        creditSum = item.credit,
                        debitSum = item.debit,
                        glComments = item.glComments,
                        comID = comID,
                        acctNo = item.acctNo,
                        relAcctNo = item.relAcctNo

                    });
                }

            }
            else
            {

                var txID = _AMDbContext.gl.Where(x => x.GLID == gl[0].GLID).ToList()[0].txID;
                var glOldList = _AMDbContext.gl.Where(x => x.txID == txID).ToList();


                foreach (var item in gl)
                {

                    glEntry.Add(new GL
                    {
                        voucherNo = glOldList[0].voucherNo,
                        cstID = 0,
                        COAID = item.COAID,
                        txTypeID = 42,
                        relCOAID = item.parentCOAID,
                        depositID = fiscalYear,
                        dtTx = dtTx,
                        crtDate = now,
                        modDate = now,
                        creditSum = item.credit,
                        debitSum = item.debit,
                        glComments = item.glComments,
                        comID = comID,
                        acctNo = item.acctNo,
                        relAcctNo = item.relAcctNo

                    });
                }



                string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == gl[0].voucherNo).ToList());
                AuditLogs al = new AuditLogs()
                {
                    methodName = "ExpenseVoucher",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = gl[0].voucherNo
                };

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.voucherNo == glOldList[0].voucherNo));
                await _AMDbContext.SaveChangesAsync();


                isEdit = true;

            }
            List<GL> lst = SaveExpense(glEntry, glComments);
            await _gLService.InsertGLEntriesAsync(lst, now, username);
            foreach (var item in gltxLinksLstSD)
            {
                item.GLID = lst.Find(x => x.txID == 0).GLID;
                await _AMDbContext.GLTxLinks.AddAsync(item);
                await _AMDbContext.SaveChangesAsync();
            }

            if (isEdit)
            {
                _notificationInterceptor.SaveNotification("ExpenseVoucherEdit", gl[0].comID, lst[0].voucherNo);
            }
            else
            {
                _notificationInterceptor.SaveNotification("ExpenseVoucherCreate", gl[0].comID, lst[0].voucherNo);
            }

            return Ok(gl);
        }

        [HttpPost]
        public async Task<IActionResult> savePaymentVoucher([FromBody] List<invoices> gl)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(gl[0].comID, gl[0].dtTx);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }
            else
            {
                fiscalYear = fy.period;
            }
            var COAID = gl[0].COAID;
            var acctNo = gl[0].acctNo;
            if(COAID == 80)
            {
                var cashInHandAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
                acctNo = cashInHandAccCode;
            }
            var vendID = gl[0].cstID;
            var comID = gl[0].comID;
            string glComments = gl[0].glComments;
            DateTime dtTx = gl[0].dtTx;
            var glid = gl[0].GLID;
            decimal total = 0;
            List<GL> gllist = new List<GL>();
            var now = DateTime.Now;

            
            if (gl[0].GLID == 0)
            {
                gl.RemoveAll(x => x.enterAmount == 0);
                foreach (var item in gl)
                {
                    var list = _AMDbContext.gl.Where(x => x.voucherNo == item.voucherNo && x.txID != 0 && x.vendID == vendID && x.balSum > 0).ToList();
                    if (list.Count > 0)
                    {
                        total += item.enterAmount;
                        list[0].balSum = list[0].balSum - item.enterAmount;
                        _AMDbContext.UpdateRange(list);

                        GLTxLinks gltxLink = new GLTxLinks()
                        {
                            relGLID = list[0].GLID, //glSaleDel.GLID,
                            txTypeID = 7,
                            amount = item.enterAmount,
                            discount = 0,
                            againstID = vendID,
                            COAID = COAID,
                            relCOAID = 83,
                            fiscalYear = fiscalYear,
                            prodID = 0,
                            prodCode = ""
                        };
                        gltxLinksLstSD.Add(gltxLink);
                    }
                }

                await _AMDbContext.SaveChangesAsync();



                string sql = "EXEC GenerateVoucherNo @txType, @comID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                     new SqlParameter { ParameterName = "@txType", Value = 7 },
                     new SqlParameter { ParameterName = "@comID", Value = gl[0].comID }
                };
                var voucherNo = _AMDbContext.invoiceNo.FromSqlRaw(sql, parms.ToArray()).ToList()[0].voucherNo;


                GL glEntry = new GL()
                {
                    voucherNo = voucherNo,
                    vendID = vendID,
                    COAID = 83,
                    txTypeID = 7,
                    relCOAID = COAID,
                    depositID = fiscalYear,
                    dtTx = dtTx,
                    crtDate = now,
                    modDate = now,
                    creditSum = total,
                    glComments = glComments,
                    comID = comID,
                    acctNo = acctNo
                };
                gllist.Add(glEntry);
            }
            else
            {
                decimal oldtotal = 0;
                foreach (var item in gl)
                {
                    var list = _AMDbContext.gl.Where(x => x.voucherNo == item.voucherNo && x.txID != 0 && x.vendID == vendID).ToList();
                    foreach (var glOldlist in list)
                    {
                        var glTxList = _AMDbContext.GLTxLinks.Where(x => x.relGLID == glOldlist.GLID && x.GLID == glid).ToList();
                        if (glTxList.Count > 0)
                        {
                            total += item.enterAmount;
                            oldtotal += glTxList[0].amount;
                            glOldlist.balSum = glOldlist.balSum + glTxList[0].amount - item.enterAmount;
                            _AMDbContext.gl.UpdateRange(glOldlist);
                            await _AMDbContext.SaveChangesAsync();

                            glTxList[0].COAID = COAID;
                            glTxList[0].amount = item.enterAmount;
                            gltxLinksLstSD.Add(glTxList[0]);
                        }
                    }
                }

                var glist = _AMDbContext.gl.Where(x => x.GLID == glid).ToList();

                GL glEntry = new GL()
                {
                    voucherNo = glist[0].voucherNo,
                    vendID = vendID,
                    COAID = 83,
                    txTypeID = 7,
                    relCOAID = COAID,
                    depositID = fiscalYear,
                    dtTx = dtTx,
                    crtDate = glist[0].crtDate,
                    modDate = now,
                    creditSum = total,
                    glComments = glComments,
                    comID = comID,
                    acctBal = glist[0].creditSum,
                    GLID = glist[0].GLID,
                    acctNo = acctNo

                };

                gllist.Add(glEntry);

                isEdit = true;
            }

            List<GL> lst = SavePayment(gllist);
            if (!isEdit)
            {
                await _gLService.InsertGLEntriesAsync(lst, now, username);
                foreach (var item in gltxLinksLstSD)
                {
                    item.GLID = lst.Find(x => x.txID == 0).GLID;
                    await _AMDbContext.GLTxLinks.AddAsync(item);
                    await _AMDbContext.SaveChangesAsync();
                }
                _notificationInterceptor.SaveNotification("PaymentVoucherCreate", gl[0].comID, gllist[0].voucherNo);
            }
            else
            {
                string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == gllist[0].voucherNo).ToList());
                AuditLogs al = new AuditLogs()
                {
                    methodName = "PaymentVoucher",
                    actionName = "Update",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = gllist[0].voucherNo
                };

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.gl.UpdateRange(lst);
                _AMDbContext.GLTxLinks.UpdateRange(gltxLinksLstSD);
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("PaymentVoucherEdit", gl[0].comID, gllist[0].voucherNo);
            }

            return Ok(gl);
        }

        [HttpGet]
        [Route("{cstID:int}/{prdID:int}/{comID:int}")]
        public async Task<IActionResult> getInvoiceDetailByCustomer(int cstID, int prdID, int comID)
        {
            fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).ToList()[0].period;

            var gl = _AMDbContext.gl.Where(x => x.cstID == cstID && x.prodID == prdID && x.COAID == 141 && x.depositID == fiscalYear).OrderByDescending(item => item.GLID).FirstOrDefault();
            if (gl == null)
                return NotFound();

            return Ok(gl);
        }

        [HttpGet]
        [Route("{txtypeID:int}/{comID}")]
        public async Task<IActionResult> getInvoicesList(int txtypeID, int comID)
        {
            List<InvoiceView> SDL;
            string sql = "EXEC InvoiceDetail @txTypeID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
                    {
                         new SqlParameter { ParameterName = "@txTypeID", Value = txtypeID },
                         new SqlParameter { ParameterName = "@comID", Value = comID },
                    };
            SDL = _AMDbContext.InvoiceView.FromSqlRaw(sql, parms.ToArray()).ToList().Where(x => x.glComments != "FromUploadTool").ToList();

            if (SDL.Count > 0)
                return Ok(SDL);

            return Ok();
        }

        [HttpGet]
        [Route("{txtypeID:int}/{cstID:int}/{comID}")]
        public async Task<IActionResult> getInvoicesListByCustomer(int txtypeID, int cstID, int comID)
        {
            List<invoices> SDL;
            string sql = "EXEC InvoiceDetailByCustomer @txTypeID,@cstID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
                    {
                         new SqlParameter { ParameterName = "@txTypeID", Value = txtypeID },
                         new SqlParameter { ParameterName = "@cstID", Value = cstID },
                         new SqlParameter { ParameterName = "@comID", Value = comID },
                    };
            SDL = _AMDbContext.invoices.FromSqlRaw(sql, parms.ToArray()).ToList().Where(x => x.glComments != "FromUploadTool").ToList();

            if (SDL.Count > 0)
                return Ok(SDL);

            return Ok();
        }

        [HttpGet]
        [Route("{txtypeID:int}/{cstID:int}/{comID}")]
        public async Task<IActionResult> GetInvoicesListByID(int txtypeID, int cstID, int comID)
        {
            fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).ToList()[0].period;
            List<GL> SDL = _AMDbContext.gl.Where(x => x.txTypeID == txtypeID && (x.cstID == cstID || x.vendID == cstID) && x.comID == comID && x.depositID == fiscalYear).ToList();
            if (SDL.Count > 0)
                return Ok(SDL.OrderByDescending(x => x.GLID));

            return NotFound();
        }

        [HttpGet]
        [Route("{cstID:int}/{prodID:int}/{comID}")]
        public async Task<IActionResult> CheckIFInvoiceExist(int cstID, int prodID, int comID)
        {
            List<StockList> SDL;
            string sql = "EXEC Report_StockList @prodID,@locID,@comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                    new SqlParameter { ParameterName = "@prodID", Value = prodID },
                    new SqlParameter { ParameterName = "@locID", Value = 0 },
                    new SqlParameter { ParameterName = "@comID", Value = comID },
            };
            SDL = _AMDbContext.StockList.FromSqlRaw(sql, parms.ToArray()).ToList();

            if (SDL.Count > 0)
                if (SDL[0].AvailableQty > 0)
                    return Ok(SDL[0]);

            return BadRequest();
        }

        [HttpDelete]
        [Route("{invoiceNo}/{comID}")]
        public async Task<IActionResult> deleteInvoice(string invoiceNo, int comID)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(comID, DateTime.Today);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }

            var taxID = 0;
            var lst = _AMDbContext.Taxes.Where(x => x.isDefault == true).ToList();
            var coa = _AMDbContext.COA.Where(x => x.acctName == lst[0].TaxName).FirstOrDefault();
            if (coa == null)
            { }
            else
            { taxID = coa.COAID; }

            var item = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo && x.txID == 0).ToList().FirstOrDefault();
            var gllist = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo).ToList();
            var glTxLinks = _AMDbContext.GLTxLinks.Where(a => a.GLID == item.GLID).ToList();
            foreach (var list in glTxLinks)
            {
                var purchaselist = _AMDbContext.gl.Where(a => a.GLID == list.relGLID).ToList();
                if (purchaselist.Count > 0)
                {
                    purchaselist[0].qtyBal += list.qty;
                    _AMDbContext.gl.Update(purchaselist[0]);
                    await _AMDbContext.SaveChangesAsync();
                }
            }
            if (glTxLinks.Count > 0)
            {
                var purchaselistToGetList = _AMDbContext.gl.Where(a => a.GLID == glTxLinks[0].relGLID).ToList();
                if (purchaselistToGetList.Count > 0)
                {
                    var purchaselistToUpdateBalSum = _AMDbContext.gl.Where(a => a.txID == purchaselistToGetList[0].txID && a.COAID == glTxLinks[0].relCOAID).FirstOrDefault();
                    if (purchaselistToUpdateBalSum != null)
                    {
                        purchaselistToUpdateBalSum.balSum += item.creditSum + item.taxSum - item.discountSum;
                        _AMDbContext.gl.Update(purchaselistToUpdateBalSum);
                        await _AMDbContext.SaveChangesAsync();
                    }
                }
            }
            var totalamount = 0;
            decimal balAmount = 0;
            if (gllist.Where(x => x.balSum > 0).ToList().Count() > 0)
            {
                balAmount = gllist.Find(x => x.balSum > 0).balSum;
            }
            else
            {
                balAmount = 0;
            }


            var quotationlist = _AMDbContext.gl.Where(x => x.glComments == "Sale Invoice Created : " + item.voucherNo).ToList();
            if (quotationlist.Count() > 0)
            {
                foreach (var qt in quotationlist)
                {
                    qt.glComments = "Convert To Sale";

                }
                _AMDbContext.gl.UpdateRange(quotationlist);
            }


            var purchaseOrder = _AMDbContext.gl.Where(x => x.glComments == "Purchase Created : " + item.voucherNo).ToList();
            if (purchaseOrder.Count() > 0)
            {
                foreach (var qt in purchaseOrder)
                {
                    qt.glComments = "Convert To Purchase";

                }
                _AMDbContext.gl.UpdateRange(purchaseOrder);
            }

            string json = JsonSerializer.Serialize(gllist);
            AuditLogs al = new AuditLogs()
            {
                methodName = "GL",
                actionName = "Delete",
                logBy = username,
                logDate = DateTime.Now,
                oldValues = json,
                voucherNo = invoiceNo
            };

            await _AMDbContext.AuditLogs.AddAsync(al);

            _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.voucherNo == invoiceNo));
            _AMDbContext.RemoveRange(_AMDbContext.GLTxLinks.Where(a => a.GLID == item.GLID && a.txTypeID == item.txTypeID));
            await _AMDbContext.SaveChangesAsync();

            if (item.txTypeID == 4)
            {
                _notificationInterceptor.SaveNotification("SaleInvoicesDelete", item.comID, item.voucherNo);

            }
            else
            {
                _notificationInterceptor.SaveNotification("PurchaseDelete", item.comID, item.voucherNo);
            }
            return Ok();
        }

        [HttpDelete]
        [Route("{ReceiptNo}/{comID}")]
        public async Task<IActionResult> deleteReceipt(string ReceiptNo, int comID)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(comID, DateTime.Today);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }

            var glList = _AMDbContext.gl.Where(x => x.voucherNo == ReceiptNo && x.txID == 0).ToList();
            if (glList.Count > 0)
            {
                decimal total = 0;
                var glTxLinksList = _AMDbContext.GLTxLinks.Where(x => x.GLID == glList[0].GLID).ToList();
                if (glTxLinksList.Count > 0)
                {

                    foreach (var item in glTxLinksList)
                    {
                        var updatedList = _AMDbContext.gl.Where(x => x.GLID == item.relGLID).ToList();
                        updatedList[0].balSum = updatedList[0].balSum + item.amount;
                        total += item.amount;
                        _AMDbContext.UpdateRange(updatedList);

                        var cstList = _AMDbContext.Customers.Where(x => x.cstID == item.againstID).ToList();
                        var coalist = _AMDbContext.COA.Where(x => x.COANo == item.againstID && x.acctName == cstList[0].cstName).ToList();
                        if (coalist.Count > 0)
                        {
                            coalist[0].bal -= item.amount;
                            // _AMDbContext.COA.UpdateRange(coalist);
                        }

                        var coalist1 = _AMDbContext.COA.Where(x => x.COAID == item.COAID).ToList();
                        if (coalist1.Count > 0)
                        {
                            coalist1[0].bal -= item.amount;
                            //_AMDbContext.COA.UpdateRange(coalist1);
                        }
                        await _AMDbContext.SaveChangesAsync();

                    }

                    List<COA> coaList = _AMDbContext.COA.Where(x => x.COANo == glList[0].cstID && x.parentCOAID == 40).ToList();
                    if (coaList.Any())
                    {
                        COA firstCOA = coaList.First();
                        firstCOA.bal += total;
                        _AMDbContext.Update(firstCOA);
                        await _AMDbContext.SaveChangesAsync(); // Save changes to the database
                    }

                    string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == ReceiptNo).ToList());
                    AuditLogs al = new AuditLogs()
                    {
                        methodName = "ReceiptVoucher",
                        actionName = "Delete",
                        logBy = username,
                        logDate = DateTime.Now,
                        oldValues = json,
                        voucherNo = ReceiptNo
                    };

                    await _AMDbContext.AuditLogs.AddAsync(al);

                    _AMDbContext.RemoveRange(_AMDbContext.GLTxLinks.Where(x => x.GLID == glList[0].GLID));
                    _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.voucherNo == ReceiptNo));
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("ReceiptVoucherDelete", glList[0].comID, glList[0].voucherNo);

                    return Ok();
                }
            }

            return NotFound("Something Went Wrong..");
        }

        [HttpDelete]
        [Route("{voucherNo}/{comID}")]
        public async Task<IActionResult> deletePayment(string voucherNo, int comID)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(comID, DateTime.Today);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }

            var glList = _AMDbContext.gl.Where(x => x.voucherNo == voucherNo && x.txID == 0).ToList();
            if (glList.Count > 0)
            {
                var glTxLinksList = _AMDbContext.GLTxLinks.Where(x => x.GLID == glList[0].GLID).ToList();
                if (glTxLinksList.Count > 0)
                {
                    decimal total = 0;
                    foreach (var item in glTxLinksList)
                    {
                        var updatedList = _AMDbContext.gl.Where(x => x.GLID == item.relGLID).ToList();
                        updatedList[0].balSum = updatedList[0].balSum + item.amount;
                        total += item.amount;
                        _AMDbContext.UpdateRange(updatedList);

                        var venlist = _AMDbContext.Vendors.Where(x => x.vendID == item.againstID).ToList();
                        var coalist = _AMDbContext.COA.Where(x => x.COANo == item.againstID && x.acctName == venlist[0].vendName).ToList();
                        if (coalist.Count > 0)
                        {
                            coalist[0].bal += item.amount;
                            // _AMDbContext.COA.UpdateRange(coalist);
                        }

                        var coalist1 = _AMDbContext.COA.Where(x => x.COAID == item.COAID).ToList();
                        if (coalist1.Count > 0)
                        {
                            coalist1[0].bal += item.amount;
                            // _AMDbContext.COA.UpdateRange(coalist1);
                        }
                        await _AMDbContext.SaveChangesAsync();

                    }

                    List<COA> coaList = _AMDbContext.COA.Where(x => x.COANo == glList[0].vendID && x.parentCOAID == 83).ToList();
                    if (coaList.Any())
                    {
                        COA firstCOA = coaList.First();
                        firstCOA.bal += total;
                        _AMDbContext.Update(firstCOA);
                        await _AMDbContext.SaveChangesAsync(); // Save changes to the database
                    }

                    string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == voucherNo).ToList());
                    AuditLogs al = new AuditLogs()
                    {
                        methodName = "PaymentVoucher",
                        actionName = "Delete",
                        logBy = username,
                        logDate = DateTime.Now,
                        oldValues = json,
                        voucherNo = voucherNo
                    };

                    await _AMDbContext.AuditLogs.AddAsync(al);

                    _AMDbContext.RemoveRange(_AMDbContext.GLTxLinks.Where(x => x.GLID == glList[0].GLID));
                    _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.voucherNo == voucherNo));
                    await _AMDbContext.SaveChangesAsync();

                    _notificationInterceptor.SaveNotification("PaymentVoucherDelete", glList[0].comID, glList[0].voucherNo);
                    return Ok();
                }
            }

            return NotFound("Something Went Wrong..");
        }

        [HttpDelete]
        [Route("{voucherNo}/{comID}")]
        public async Task<IActionResult> deleteJournal(string voucherNo, int comID)
        {
            var fy = await _helperMethods.GetActiveFiscalYear(comID, DateTime.Today);
            if (fy == null)
            {
                return BadRequest("Fiscal year selection is outdated. Please choose a fiscal year that is currently valid.");
            }

            var glList = _AMDbContext.gl.Where(x => x.voucherNo == voucherNo && x.txID != 0).ToList();
            if (glList.Count > 0)
            {
                foreach (var item in glList)
                {

                    var coalist = _AMDbContext.COA.Where(x => x.COAID == item.relCOAID).ToList();
                    if (item.debitSum > 0)
                    {
                        coalist[0].bal -= item.debitSum;
                    }
                    else if (item.creditSum > 0)
                    {
                        coalist[0].bal += item.creditSum;
                    }

                    //_AMDbContext.COA.Update(coalist.FirstOrDefault());
                    await _AMDbContext.SaveChangesAsync();
                }

                string json = JsonSerializer.Serialize(_AMDbContext.gl.Where(x => x.voucherNo == voucherNo).ToList());
                AuditLogs al = new AuditLogs()
                {
                    methodName = "JournalVoucher",
                    actionName = "Delete",
                    logBy = username,
                    logDate = DateTime.Now,
                    oldValues = json,
                    voucherNo = voucherNo
                };

                await _AMDbContext.AuditLogs.AddAsync(al);

                _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.voucherNo == voucherNo));
                await _AMDbContext.SaveChangesAsync();

                _notificationInterceptor.SaveNotification("JournalVoucherDelete", glList[0].comID, glList[0].voucherNo);
                return Ok();
            }
            return NotFound("Something Went Wrong..");
        }

        [HttpPost]
        public async Task<IActionResult> deleteInvoiceRow([FromBody] List<invoiceNo> GLID)
        {
            if (GLID[0].voucherNo != null)
            {
                foreach (var item in GLID)
                {
                    var mainGLID = _AMDbContext.gl.Where(x => x.GLID == int.Parse(item.voucherNo)).ToList().FirstOrDefault();
                    if (mainGLID.txTypeID == 4)
                    {

                        var gllist = _AMDbContext.gl.Where(x => x.voucherNo == mainGLID.voucherNo).ToList();
                        var glTxLinks = _AMDbContext.GLTxLinks.Where(a => a.GLID == mainGLID.txID && a.prodID == item.prodID).ToList();
                        foreach (var list in glTxLinks)
                        {
                            var purchaselist = _AMDbContext.gl.Where(a => a.GLID == list.relGLID).ToList();
                            if (purchaselist.Count > 0)
                            {
                                purchaselist[0].qtyBal += gllist.Find(x => x.prodID == list.prodID && x.COAID == 141).qty;
                                _AMDbContext.Update(purchaselist[0]);
                            }
                        }
                        _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.GLID == int.Parse(item.voucherNo)));
                        _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.GLID == int.Parse(item.voucherNo) + 1));
                        _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.GLID == int.Parse(item.voucherNo) + 2));
                        _AMDbContext.RemoveRange(_AMDbContext.GLTxLinks.Where(a => a.GLID == mainGLID.txID && a.prodID == item.prodID));
                        await _AMDbContext.SaveChangesAsync();
                    }
                    else
                    {
                        _AMDbContext.RemoveRange(_AMDbContext.gl.Where(a => a.GLID == int.Parse(item.voucherNo)));
                        await _AMDbContext.SaveChangesAsync();
                    }
                }
                return Ok();
            }
            return NotFound();
        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> getOneInvoiceDetail(string invoiceNo)
        {

            List<GL> SDL;
            //string sql = "EXEC getOneInvoiceDetail @voucherNo";
            //List<SqlParameter> parms = new List<SqlParameter>
            //        {
            //             new SqlParameter { ParameterName = "@voucherNo", Value = invoiceNo },
            //        };
            //SDL = _AMDbContext.SaleDelivery.FromSqlRaw<SaleDelivery>(sql, parms.ToArray()).ToList();
            SDL = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString()).ToList();
            foreach (var item in SDL)
            {
                if (item.txTypeID == 4 || item.txTypeID == 11 || item.txTypeID == 5)
                {
                    if (item.COAID == 141 || item.COAID == 137)
                    {
                        item.prodName = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodName.ToString();
                        item.prodCode = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodCode.ToString();
                    }
                    item.cstName = _AMDbContext.Customers.FirstOrDefault(x => x.cstID == item.cstID).cstName.ToString();

                }
                else if (item.txTypeID == 16)
                {
                    if (item.relCOAID == 141)
                    {
                        item.prodName = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodName.ToString();
                        item.prodCode = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodCode.ToString();
                    }
                    item.cstName = _AMDbContext.Customers.FirstOrDefault(x => x.cstID == item.cstID).cstName.ToString();

                }
                else if (item.txTypeID == 1 || item.txTypeID == 3 || item.txTypeID == 2)
                {
                    if (item.COAID == 98 || item.relCOAID == 83 && item.prodID != 0)
                    {
                        item.prodName = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodName.ToString();
                        item.prodCode = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodCode.ToString();
                    }
                    item.cstName = _AMDbContext.Vendors.FirstOrDefault(x => x.vendID == item.vendID).vendName.ToString();
                }
                else if (item.txTypeID == 6)
                {
                    item.cstName = _AMDbContext.Customers.FirstOrDefault(x => x.cstID == item.cstID).cstName.ToString();
                }
                else if (item.txTypeID == 7)
                {
                    item.cstName = _AMDbContext.Vendors.FirstOrDefault(x => x.vendID == item.vendID).vendName.ToString();
                }
                else if (item.txTypeID == 43)
                {
                    if (item.COAID == 98)
                    {
                        item.prodName = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodName.ToString();
                        item.prodCode = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodCode.ToString();
                    }
                }
                if (item.txTypeID != 6 && item.txTypeID != 7 && item.txTypeID != 8 && item.txTypeID != 43)
                {
                    var taxID = SDL.Find(x => x.checkName == "tax").COAID;
                    if (taxID != null)
                    {
                        var taxName = _AMDbContext.COA.Where(x => x.COAID == taxID).ToList().FirstOrDefault().acctName;
                        SDL[0].taxName = taxName;
                    }
                }

            }
            return Ok(SDL);
        }

        [HttpPost]
        public async Task<IActionResult> UploadStockAdjustment()
        {
            try
            {
                var comID = int.Parse(Request.Headers["comID"].ToString());

                int fiscalYear = _AMDbContext.FiscalYear.Where(x => x.active == true && x.comID == comID).FirstOrDefault().period;
                string voucherNo = "";
                decimal totalAmount = 0M;
                decimal totalQty = 0M;

                var form = Request.Form;
                var list = new List<GL>();
                int countNotInsertedRow = 0;
                int countInsertedRow = 0;
                int countWrongCompanyName = 0;
                int countEmptyRow = 0;
                string ExistRowNumber = "";
                string EmptyRowNumber = "";
                string EmptyRowNumberForCompany = "";

                List<StockList> stockList;
                string sql = "EXEC Report_StockList @prodID,@locID,@comID, @catID";
                List<SqlParameter> parms = new List<SqlParameter>
                {
                        new SqlParameter { ParameterName = "@prodID", Value = 0 },
                        new SqlParameter { ParameterName = "@locID", Value = 0 },
                        new SqlParameter { ParameterName = "@comID", Value = comID },
                        new SqlParameter { ParameterName = "@catID", Value = 0 }
                };
                stockList = _AMDbContext.StockList.FromSqlRaw(sql, parms.ToArray()).ToList();

                foreach (var file in form.Files)
                {
                    using (var stream = new MemoryStream())
                    {
                        file.CopyTo(stream);
                        using (var workbook = new XLWorkbook(stream))
                        {
                            var worksheet = workbook.Worksheet(1);

                            if (
                               worksheet.Cell(1, 1).Value.ToString() == "PRODUCT CODE" &&
                               worksheet.Cell(1, 2).Value.ToString() == "PRODUCT NAME" &&
                               worksheet.Cell(1, 3).Value.ToString() == "AVAILABLE QTY" &&
                               worksheet.Cell(1, 4).Value.ToString() == "UPDATE QTY" &&
                               worksheet.Cell(1, 5).Value.ToString() == "LOCATION"
                               )
                            {
                                for (int i = 2; i <= worksheet.RowsUsed().Count(); i++)
                                {
                                    var location = _AMDbContext.Locations.Where(x => x.LocationName == worksheet.Cell(i, 5).Value.ToString()).ToList();
                                    if (location.Count() > 0)
                                    {
                                        var existList = _AMDbContext.Products.Where(x => x.comID == comID && x.prodCode == worksheet.Cell(i, 1).Value.ToString() && x.prodName == worksheet.Cell(i, 2).Value.ToString());
                                        if (existList.Count() == 1 && float.Parse(worksheet.Cell(i, 4).Value.ToString()) != 0)
                                        {
                                            GL glEntry = new GL()
                                            {
                                                txTypeID = 43,
                                                voucherNo = null,
                                                type = "Cash",
                                                COAID = 98,
                                                relCOAID = 81,
                                                cstID = 0,
                                                discountSum = 0,
                                                taxSum = 0,
                                                checkNo = "",
                                                empID = 0,
                                                vendID = 0,
                                                bonusQty = stockList.Find(x => x.prodID == existList.FirstOrDefault().prodID).AvailableQty,
                                                active = true,
                                                dtTx = DateTime.Now,
                                                dtDue = DateTime.Now,
                                                crtDate = DateTime.Now,
                                                modDate = DateTime.Now,
                                                depositID = fiscalYear,
                                                prodID = existList.FirstOrDefault().prodID,
                                                locID = location[0].LocationId,
                                                comID = comID,
                                                balSum = 0,
                                                unitPrice = stockList.Find(x => x.prodID == existList.FirstOrDefault().prodID).unitPrice,
                                                qty = decimal.Parse(worksheet.Cell(i, 4).Value.ToString()) - decimal.Parse(stockList.Find(x => x.prodID == existList.FirstOrDefault().prodID).AvailableQty.ToString()),
                                                creditSum = 0,
                                                isPaid = false,
                                                isCleared = false,
                                                isVoided = false,
                                                isDeposited = false,
                                                glComments = "FromUploadSheetStockAdjustment",
                                                paidSum = 0,
                                                crtBy = username,
                                                modBy = username
                                            };

                                            list.Add(glEntry);
                                        }
                                        else
                                        {
                                            countEmptyRow++;
                                            EmptyRowNumber = EmptyRowNumber + i + " , ";
                                        }
                                    }
                                    else
                                    {
                                        return NotFound("Location name is incorrect");
                                    }
                                }
                            }
                            else
                            {
                                return BadRequest("header name is incorrect");
                            }
                        }
                    }
                }

                if (list.Count > 0)
                {
                    await SaveStockAdjustment(list);
                    return Ok(list);
                }
                return NotFound("Please Upload Correct File.");
            }
            catch (Exception ex)
            {
                return NotFound(ex.Message);
            }

        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> getOneVoucherDetail(string invoiceNo)
        {

            List<voucherDetail> SDL;
            string sql = "EXEC getOneVoucherDetail @voucherNo";
            List<SqlParameter> parms = new List<SqlParameter>
                    {
                         new SqlParameter { ParameterName = "@voucherNo", Value = invoiceNo },
                    };
            SDL = _AMDbContext.voucherDetail.FromSqlRaw(sql, parms.ToArray()).ToList();

            return Ok(SDL);
        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> getPaymentDetail(string invoiceNo)
        {

            List<GL> SDL;
            List<GLTxLinks> gltxlinks;
            List<GL> gllist;
            List<invoices> paymentlist = new List<invoices>() { };
            SDL = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString() && (x.COAID == 83 || x.COAID == 40)).ToList();
            if (SDL.Count > 0)
            {
                gltxlinks = _AMDbContext.GLTxLinks.Where(x => x.relGLID == SDL[0].GLID).ToList();
                foreach (var item in gltxlinks)
                {
                    gllist = _AMDbContext.gl.Where(x => x.GLID == item.GLID).ToList();
                    var accountName = _AMDbContext.COA.Where(x => x.COAID == item.COAID).ToList()[0].acctName;
                    paymentlist.Add(new invoices { voucherNo = gllist[0].voucherNo, amount = item.amount, dtTx = DateTime.Parse(gllist[0].dtTx.ToString()), cstName = accountName });
                }

                return Ok(paymentlist);
            }
            return Ok();
        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> getCashPaymentDetail(string invoiceNo)
        {

            List<GL> SDL;
            List<GL> gllist;
            List<invoices> paymentlist = new List<invoices>() { };
            var masterEntry = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString() && x.txID == 0).FirstOrDefault();
            SDL = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString() && x.relCOAID == 141).ToList();
            if (SDL.Count > 0)
            {
                foreach (var item in SDL)
                {
                    var accountName = _AMDbContext.COA.Where(x => x.COAID == item.COAID).ToList()[0].acctName;
                    if (item.COAID == 80)
                    {
                        item.debitSum = item.debitSum - masterEntry.discountSum;
                    }
                    if (item.debitSum > 0)
                    {
                        paymentlist.Add(new invoices { voucherNo = item.voucherNo, amount = item.debitSum, dtTx = DateTime.Parse(item.dtTx.ToString()), cstName = accountName });
                    }
                }

                return Ok(paymentlist);
            }
            return Ok();
        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> GetReturnDetail(string invoiceNo)
        {

            List<GL> SDL;
            List<GLTxLinks> gltxlinks;
            List<GL> gllist;
            SDL = _AMDbContext.gl.Where(x => x.checkName == invoiceNo.ToString()).ToList();
            if (SDL.Count > 0)
            {
                foreach (var item in SDL)
                {
                    if (item.COAID == 98 || item.COAID == 137)
                    {
                        item.prodName = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodName.ToString();
                        item.prodCode = _AMDbContext.Products.FirstOrDefault(x => x.prodID == item.prodID).prodCode.ToString();
                    }
                }

                return Ok(SDL);
            }
            return Ok();
        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> getVoucherDetail(string invoiceNo)
        {

            List<GL> SDL;
            List<GLTxLinks> gltxlinks;
            List<GL> gllist;
            List<invoices> paymentlist = new List<invoices>() { };
            SDL = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString() && x.txID == 0).ToList();
            if (SDL.Count > 0)
            {
                gltxlinks = _AMDbContext.GLTxLinks.Where(x => x.GLID == SDL[0].GLID).ToList();
                foreach (var item in gltxlinks)
                {
                    gllist = _AMDbContext.gl.Where(x => x.GLID == item.relGLID).ToList();
                    var coaList = _AMDbContext.COA.Where(x => x.COAID == item.COAID).ToList()[0];
                    var creditCardlist = _AMDbContext.CreditCards.Where(x => x.cardID == coaList.COANo).FirstOrDefault();
                    var bankList = _AMDbContext.Banks.Where(x => x.bankID == coaList.COANo).FirstOrDefault();
                    var accountName = "";

                    if (coaList.parentCOAID == 79)
                    {
                        if (bankList != null)
                        {
                            accountName = bankList.bankName + " - " + bankList.accountNo;
                        }
                        else
                        {
                            accountName = coaList.acctName;
                        }
                    }
                    else
                    {
                        accountName = coaList.acctName;
                    }

                    paymentlist.Add(new invoices { voucherNo = gllist[0].voucherNo, amount = item.amount, dtTx = DateTime.Parse(gllist[0].dtTx.ToString()), cstName = accountName });
                }

                return Ok(paymentlist);
            }
            return Ok();
        }

        [HttpGet]
        [Route("{invoiceNo}")]
        public async Task<IActionResult> getJournalVoucherDetail(string invoiceNo)
        {

            List<GL> SDL;
            List<journalVoucher> list = new List<journalVoucher>() { };
            SDL = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString() && x.txID != 0).ToList();
            string comment = _AMDbContext.gl.Where(x => x.voucherNo == invoiceNo.ToString() && x.txID == 0).FirstOrDefault().glComments;
            foreach (var item in SDL)
            {
                var ChildaccountName = _AMDbContext.COA.Where(x => x.COAID == item.COAID).ToList()[0].acctName;
                var ParentaccountName = _AMDbContext.COA.Where(x => x.COAID == item.relCOAID).ToList()[0].acctName;
                list.Add(new journalVoucher
                {
                    parentAccountName = ParentaccountName,
                    ChildAccountName = ChildaccountName,
                    dtTx = DateTime.Parse(item.dtTx.ToString()),
                    debit = item.debitSum,
                    credit = item.creditSum,
                    voucherNo = item.voucherNo,
                    GLID = item.GLID,
                    parentCOAID = item.relCOAID,
                    COAID = item.COAID,
                    glComments = item.glComments,
                    masterEntryComment = comment,
                    acctNo = item.acctNo,
                    relAcctNo = item.relAcctNo
                });
            }
            if (list.Count > 0)
            {
                return Ok(list);
            }

            return Ok();
        }

        private decimal PurhcaseInvoiceUpdateAsync(int prodID, decimal totalQty, int oldID, decimal balAmount, decimal untPirce, GL obj)
        {

            List<GLTxLinks> stock = new List<GLTxLinks>();

            decimal untPrc = 0m;
            decimal prodTotal = 0;
            List<GL> glList = new List<GL>();

            glPurchasedInvoicesLst = _AMDbContext.gl.Where(x => x.COAID == 98 && x.qty > 0 && x.prodID == prodID && x.isVoided == false && (x.txTypeID == 1 || x.txTypeID == 40 || x.txTypeID == 5 || x.txTypeID == 12 || x.txTypeID == 41)).ToList();
            glList = _AMDbContext.gl.Where(x => x.prodID == prodID && x.txTypeID == 1 && x.qtyBal > 0).ToList();

            List<Stock> list;
            string sql = "EXEC GetAvailStockByProdID @prdID, @comID";
            List<SqlParameter> parms = new List<SqlParameter>
            {
                 new SqlParameter { ParameterName = "@prdID", Value = prodID },
                 new SqlParameter { ParameterName = "@comID", Value = obj.comID }
            };

            list = _AMDbContext.Stock.FromSqlRaw(sql, parms.ToArray()).ToList();
            var stockList = list;

            List<GL> Gitem = new List<GL>();

            var item = glList.OrderBy(t => t.expiry).ToList();
            var itemList = item.ToList();

            var oldQty = (int)(glSaleDelList.FirstOrDefault(x => x.prodID == prodID && x.COAID == 141) == null ? 0 : glSaleDelList.FirstOrDefault(x => x.prodID == prodID && x.COAID == 141).qty);
            if (!isEdit)
            {
                prodTotal = (int)stockList.ToList().FindAll(x => x.prodID == prodID).Sum(x => x.qty);
            }
            else
            {
                prodTotal = (int)stockList.ToList().FindAll(x => x.prodID == prodID).Sum(x => x.qty) + oldQty;

            }

            #region ---- Add FinishGoods Entries in GlxtLinks ----

            if (prodTotal >= totalQty)
            {
                List<GL> glLst = new List<GL>();
                //glLst.AddRange(glPurchasedInvoicesLst.Where(x => x.prodID == prodID && x.locID == locID));

                if (itemList.Count == 0)
                {
                    glLst = new List<GL>();
                    glLst.Add(glList.FindAll(x => x.prodID == obj.prodID).LastOrDefault(x => x.qty >= obj.qty));
                }

                foreach (var purch in itemList.FindAll(x => x.prodID == obj.prodID))
                {

                    glLst.Add(glList.Find(x => x.GLID == purch.GLID && x.prodID == prodID));
                }

                //glLst.AddRange(glPurchasedInvoicesLst.Where(x => x.GLID == itemList[0].GLID && x.locID == locID && x.prodID == prodID));


                foreach (GL glprod in glLst)
                {

                    if (glprod != null)
                    {

                        if (itemList.Count != 0 && glprod.qtyBal + oldQty > 0 && totalQty > itemList.Find(x => x.GLID == glprod.GLID).qtyBal + oldQty || totalQty > glprod.qtyBal + oldQty)//(glprod.qtyBal > 0 && totalQty >= itemList.Find(x => x.GLID == glprod.GLID).qty)
                        {
                            gltxLnks = new GLTxLinks
                            {
                                relGLID = glprod.GLID,
                                COAID = 98,
                                relCOAID = 81,
                                txTypeID = 4,
                                prodID = glprod.prodID,
                                prodCode = obj.batchNo,
                                fiscalYear = fiscalYear,
                                againstID = obj.cstID,
                                qty = glprod.qtyBal + oldQty,
                                balAmount = glprod.unitPrice,
                                amount = (glprod.qtyBal + oldQty) * glprod.unitPrice
                            };
                            untPrc += (glprod.qtyBal + oldQty) * glprod.unitPrice;
                            totalQty -= glprod.qtyBal + oldQty;
                            glprod.qtyBal = 0;
                            glPurchaseInvUpdLst.Add(glprod);
                        }

                        else if (itemList.Count != 0 && glprod.qtyBal + oldQty >= 0 && totalQty <= itemList.Find(x => x.GLID == glprod.GLID).qtyBal + oldQty)// &&  // this is Old expression
                        {
                            gltxLnks = new GLTxLinks()
                            {
                                relGLID = glprod.GLID,
                                COAID = 98,
                                relCOAID = 81,
                                txTypeID = 4,
                                prodID = glprod.prodID,
                                prodCode = glprod.batchNo,
                                fiscalYear = fiscalYear,
                                balAmount = glprod.unitPrice,
                                againstID = obj.cstID,
                                qty = totalQty,
                                amount = totalQty * glprod.unitPrice
                            };
                            untPrc += totalQty * glprod.unitPrice;
                            if (glprod.qtyBal != 0) { glprod.qtyBal = glprod.qtyBal + oldQty - totalQty; }
                            totalQty = 0;
                            glPurchaseInvUpdLst.Add(glprod);
                        }

                        if (!isEdit)
                        {
                            gltxLinksLstSD.Add(gltxLnks);
                        }
                        else
                        {
                            gltxLnks.GLID = glSaleDelList.Find(x => x.voucherNo == obj.voucherNo && x.COAID == 141 && x.prodID == prodID) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj.voucherNo && x.COAID == 141 && x.prodID == prodID).GLID;
                            gltxLnks.GLTxLinkID = _AMDbContext.GLTxLinks.Where(x => x.GLID == gltxLnks.GLID && x.fiscalYear == fiscalYear && x.againstID == gltxLnks.againstID && x.prodID == gltxLnks.prodID && x.relGLID == gltxLnks.relGLID) == null ? 0 : _AMDbContext.GLTxLinks.Where(x => x.GLID == gltxLnks.GLID && x.fiscalYear == fiscalYear && x.againstID == gltxLnks.againstID && x.prodID == gltxLnks.prodID && x.relGLID == gltxLnks.relGLID).FirstOrDefault().GLTxLinkID;
                            gltxLinksUpdated.Add(gltxLnks);
                        }

                    }

                    if (glPurchaseInvUpdLst.Count > 0) { _AMDbContext.gl.UpdateRange(glPurchaseInvUpdLst); }
                    if (totalQty == 0) { break; }
                }
            }
            #endregion

            return untPrc;
        }

        public static string AmountInWords(int Num)
        {
            string[] Below20 = { "", "One ", "Two ", "Three ", "Four ",
              "Five ", "Six " , "Seven ", "Eight ", "Nine ", "Ten ", "Eleven ",
            "Twelve " , "Thirteen ", "Fourteen ","Fifteen ",
              "Sixteen " , "Seventeen ","Eighteen " , "Nineteen " };
            string[] Below100 = { "", "", "Twenty ", "Thirty ",
              "Forty ", "Fifty ", "Sixty ", "Seventy ", "Eighty ", "Ninety " };

            string InWords = "";
            if (Num >= 1 && Num < 20)
                InWords += Below20[Num];
            if (Num >= 20 && Num <= 99)
                InWords += Below100[Num / 10] + Below20[Num % 10];
            if (Num >= 100 && Num <= 999)
                InWords += AmountInWords(Num / 100) + " Hundred " + AmountInWords(Num % 100);
            if (Num >= 1000 && Num <= 99999)
                InWords += AmountInWords(Num / 1000) + " Thousand " + AmountInWords(Num % 1000);
            if (Num >= 100000 && Num <= 9999999)
                InWords += AmountInWords(Num / 100000) + " Lac " + AmountInWords(Num % 100000);
            if (Num >= 10000000)
                InWords += AmountInWords(Num / 10000000) + " Crore " + AmountInWords(Num % 10000000);
            return InWords;
        }

        [NonAction]
        public List<GL> SaveStockEntry(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            glPurchaseInvUpdLst = new List<GL>();
            gltxLnks = new GLTxLinks();
            gltxLinksUpdated = new List<GLTxLinks>();
            gltxLinksDelete = new List<GLTxLinks>();
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);


            int accountID = 81;

            if (!isEdit) { gltxLinksLstSD = new List<GLTxLinks>(); }

            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = 0,
                discountSum = 0,
                taxSum = 0,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = "",
                glComments = obj1[0].glComments,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                balSum = 0,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            else
            {
                glMasterEntry.crtBy = obj1[0].crtBy;
                glMasterEntry.crtDate = obj1[0].crtDate;
            }
            glLt.Add(glMasterEntry);
            #endregion


            #region ------- GltxLinksAgainst Sale Invoices -------
            List<GL> GLDetails = new List<GL>();
            decimal sumTotal = 0;
            foreach (GL obj in obj1.FindAll(x => x.prodID != 0))
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;
                    #region ------ Sale Delivery Product 1 Entry -------
                    if (!isEdit)
                    {
                        pro1.GLID = 0;
                    }
                    else
                    {
                        if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                        else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                    }

                    pro1.dtTx = obj.dtTx;
                    pro1.depositID = fiscalYear;
                    pro1.cstID = obj.cstID;
                    pro1.salesManID = obj.salesManID;
                    pro1.COAID = 98;
                    pro1.relCOAID = accountID;
                    pro1.acctNo = stockInTradeAccCode;
                    pro1.relAcctNo = costOfGoodsAccCode;
                    pro1.creditSum = obj.qty * obj.unitPrice; //obj.creditSum;
                    pro1.qtyBal = pro1.qty;
                    pro1.txTypeID = obj1[0].txTypeID;
                    pro1.batchNo = obj.batchNo;
                    pro1.expiry = obj.expiry;
                    pro1.claim = obj.claim;
                    pro1.isPaid = false;
                    pro1.isVoided = false;
                    pro1.isDeposited = false;
                    pro1.isCleared = false;
                    pro1.discountSum = obj.paidSum;
                    pro1.checkNo = obj.checkNo;
                    pro1.checkAdd = obj.checkAdd;
                    pro1.tradeOffer = obj.tradeOffer;
                    pro1.creditOffer = obj.creditOffer;
                    pro1.bonusSum = obj.bonusSum;
                    pro1.voidedSum = obj.voidedSum;
                    pro1.taxSum = 0;
                    pro1.checkName = obj.checkName;
                    pro1.crtDate = obj.crtDate;
                    pro1.crtBy = pro1.modBy = obj.crtBy;
                    pro1.modDate = DateTime.Now;
                    pro1.glComments = obj.glComments;
                    pro1.locID = obj.locID;
                    pro1.comID = obj.comID;
                    sumTotal += pro1.creditSum;
                    if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                    else { pro1.voucherNo = obj.voucherNo; }

                    totalQty += pro1.qty;

                    totalDiscount += pro1.discountSum;
                    glLt.Add(pro1);
                    #endregion
                }
            }

            #endregion

            #region -------- GL Product Ledger Record ---------
            g2 = new GL();
            glMasterEntry.Clone(g2);
            g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == accountID) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == accountID).GLID;
            g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
            g2.depositID = fiscalYear;
            g2.txTypeID = obj1[0].txTypeID;
            g2.creditSum = 0;
            g2.COAID = accountID;
            g2.relCOAID = 98;
            g2.acctNo = costOfGoodsAccCode;
            g2.relAcctNo = stockInTradeAccCode;
            g2.voucherNo = glMasterEntry.voucherNo;
            g2.salesManID = obj1[0].salesManID;
            g2.glComments = obj1[0].glComments;
            g2.instituteOffer = 0;
            g2.debitSum = sumTotal;
            g2.taxSum = 0;
            g2.cstID = obj1[0].cstID;
            g2.dtTx = obj1[0].dtTx;
            g2.paidSum = 0;
            g2.discountSum = 0;
            g2.glComments = string.Empty;
            g2.salesManID = obj1[0].salesManID;
            g2.glComments = obj1[0].glComments;
            g2.crtBy = g2.modBy = obj1[0].crtBy;
            g2.isPaid = false;
            g2.isVoided = false;
            g2.isDeposited = false;
            g2.isCleared = false;
            g2.locID = obj1[0].locID;
            g2.comID = obj1[0].comID;
            glLt.Add(g2);

            return glLt;

            #endregion
        }

        [NonAction]
        public List<GL> SaveSales(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            glPurchaseInvUpdLst = new List<GL>();
            gltxLnks = new GLTxLinks();
            gltxLinksUpdated = new List<GLTxLinks>();
            gltxLinksDelete = new List<GLTxLinks>();
            //141
            var saleLocalAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleLocal);
            //80
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);

            int accountID = 40;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            if (!isEdit) { gltxLinksLstSD = new List<GLTxLinks>(); }

            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = "",
                glComments = obj1[0].glComments,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (accountID == 40)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            else
            {
                glMasterEntry.crtBy = obj1[0].crtBy;
                glMasterEntry.crtDate = obj1[0].crtDate;
            }
            glLt.Add(glMasterEntry);
            #endregion

            #region -------- Add Sale  products Entries -------


          

            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1.FindAll(x => x.prodID != 0))
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;

                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                            else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                        }

                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.cstID = obj.cstID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 141;
                        pro1.acctNo = saleLocalAccCode;
                        pro1.relAcctNo = cashOrCreditAccCode;
                        pro1.relCOAID = accountID;
                        pro1.creditSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.qtyBal = pro1.qty;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;
                        pro1.checkAdd = obj.checkAdd;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = obj.crtDate;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.modDate = DateTime.Now;
                        pro1.glComments = obj.glComments;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;

                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }

                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion

                        #region ------ Sale Delivery Product 2 Entry -------
                        pro2 = new GL();
                        pro1.Clone(pro2);
                        if (!isEdit) { pro2.GLID = 0; }
                        else
                        {
                            if (pro1.GLID > 0) { pro2.GLID = pro1.GLID + 1; pro2.txID = pro1.txID; }
                            else { pro2.GLID = 0; pro2.txID = pro2.txID = pro1.txID; }
                        }
                        pro2.empID = obj.empID;
                        pro2.dtTx = obj.dtTx;
                        pro2.prodID = obj.prodID;
                        pro2.COAID = 98;
                        pro2.qtyBal = 0;
                        pro2.relCOAID = 81;
                        pro2.acctNo = stockInTradeAccCode;
                        pro2.relAcctNo = costOfGoodsAccCode;
                        pro2.txTypeID = obj.txTypeID;
                        pro2.depositID = fiscalYear;
                        pro2.cstID = obj.cstID;
                        pro2.voucherNo = obj.voucherNo;
                        decimal unitPrc = PurhcaseInvoiceUpdateAsync(pro2.prodID, pro1.qty, pro2.GLID, pro1.unitPrice, pro2.unitPrice, obj);
                        unitPrc = unitPrc == 0 ? pro1.unitPrice : unitPrc;
                        pro2.unitPrice = unitPrc / obj.qty;
                        pro2.creditSum = unitPrc;
                        pro2.glComments = obj.glComments;
                        pro2.crtDate = obj.crtDate;
                        pro2.modDate = DateTime.Now;
                        pro2.isVoided = false;
                        pro2.isPaid = false;
                        pro2.isDeposited = false;
                        pro2.isCleared = false;
                        pro2.qty = -(pro1.qty + pro1.bonusQty);
                        pro2.locID = obj.locID;
                        pro2.comID = obj.comID;
                        pro2.paidSum = 0;
                        pro2.checkNo = "";

                        glLt.Add(pro2);

                        #endregion

                        #region ------ Sale Delivery Product 3 Entry -------
                        pro3 = new GL();
                        pro2.Clone(pro3);
                        if (!isEdit) { pro3.GLID = 0; }
                        else
                        {
                            if (pro2.GLID > 0) { pro3.GLID = pro2.GLID + 1; pro3.txID = pro1.txID; }
                            else { pro3.GLID = 0; pro3.txID = pro1.txID; }
                        }
                        pro3.empID = 0;
                        pro3.locID = obj.locID;
                        pro3.COAID = pro2.relCOAID;
                        pro3.relCOAID = pro2.COAID;
                        pro3.acctNo = pro2.relAcctNo;
                        pro3.relAcctNo = pro2.acctNo;
                        pro3.prodID = obj.prodID;
                        pro3.dtTx = obj.dtTx;
                        pro3.checkNo = string.Empty;
                        pro3.txTypeID = obj.txTypeID;
                        pro3.depositID = fiscalYear;
                        pro3.cstID = obj.cstID;
                        pro3.voucherNo = obj.voucherNo;
                        pro3.qty = pro1.qty;
                        pro3.qtyBal = pro1.qtyBal;
                        pro3.creditSum = 0;
                        pro3.unitPrice = pro2.unitPrice;
                        pro3.glComments = obj.glComments;
                        pro3.crtDate = obj.crtDate;
                        pro3.debitSum = pro2.creditSum;
                        pro3.modDate = DateTime.Now;
                        pro3.isPaid = false;
                        pro3.isVoided = false;
                        pro3.isDeposited = false;
                        pro3.isCleared = false;
                        pro3.locID = obj.locID;
                        pro3.comID = obj.comID;
                        glLt.Add(pro3);
                        #endregion
                    }
                }
            }


            #endregion

            #region -------- GL Product Ledger Record ---------

            if (accountID == 40)
            {
                g2 = new GL();
                glMasterEntry.Clone(g2);
                g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == accountID) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == accountID).GLID;
                g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
                g2.depositID = fiscalYear;
                g2.txTypeID = obj1[0].txTypeID;
                g2.creditSum = 0;
                g2.COAID = accountID;
                g2.relCOAID = 141;
                g2.acctNo = cashOrCreditAccCode;
                g2.relAcctNo = saleLocalAccCode;
                g2.voucherNo = glMasterEntry.voucherNo;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.instituteOffer = 0;
                g2.debitSum = obj1[0].creditSum + obj1[0].taxSum;
                g2.taxSum = 0;
                g2.cstID = obj1[0].cstID;
                g2.dtTx = obj1[0].dtTx;
                g2.paidSum = 0;
                g2.discountSum = 0;
                g2.glComments = string.Empty;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.crtBy = g2.modBy = obj1[0].crtBy;
                g2.isPaid = false;
                g2.isVoided = false;
                g2.isDeposited = false;
                g2.isCleared = false;
                g2.locID = obj1[0].locID;
                g2.comID = obj1[0].comID;
                glLt.Add(g2);
            }
            else
            {
                if (obj1.FindAll(x => x.prodID == 0).Count > 0)
                {

                    foreach (var item in obj1.FindAll(x => x.prodID == 0))
                    {
                        g2 = new GL();
                        glMasterEntry.Clone(g2);
                        g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                        g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == item.COAID) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == item.COAID).GLID;
                        g2.depositID = fiscalYear;
                        g2.txTypeID = obj1[0].txTypeID;
                        g2.creditSum = 0;
                        g2.COAID = item.COAID;
                        g2.relCOAID = 141;
                        g2.acctNo = item.COAID == 80 ? cashOrCreditAccCode : item.acctNo;
                        g2.relAcctNo = saleLocalAccCode;
                        g2.voucherNo = glMasterEntry.voucherNo;
                        g2.salesManID = obj1[0].salesManID;
                        g2.glComments = obj1[0].glComments;
                        g2.instituteOffer = 0;
                        g2.balSum = 0;
                        g2.debitSum = item.creditSum + (item.COAID == 80 ? obj1[0].discountSum : 0);
                        g2.taxSum = 0;
                        g2.cstID = obj1[0].cstID;
                        g2.dtTx = obj1[0].dtTx;
                        g2.paidSum = 0;
                        g2.discountSum = 0;
                        g2.glComments = string.Empty;
                        g2.salesManID = obj1[0].salesManID;
                        g2.glComments = obj1[0].glComments;
                        g2.crtBy = g2.modBy = obj1[0].crtBy;
                        g2.isPaid = false;
                        g2.isVoided = false;
                        g2.isDeposited = false;
                        g2.isCleared = false;
                        g2.locID = obj1[0].locID;
                        g2.comID = obj1[0].comID;
                        glLt.Add(g2);
                    }
                }
                else
                {
                    g2 = new GL();
                    glMasterEntry.Clone(g2);
                    g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                    g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == accountID) == null ? 0 : glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141 && x.COAID == accountID).GLID;
                    g2.balSum = 0;
                    g2.depositID = fiscalYear;
                    g2.txTypeID = obj1[0].txTypeID;
                    g2.creditSum = 0;
                    g2.COAID = accountID;
                    g2.relCOAID = 141;
                    g2.acctNo = cashOrCreditAccCode;
                    g2.relAcctNo = saleLocalAccCode;
                    g2.voucherNo = glMasterEntry.voucherNo;
                    g2.salesManID = obj1[0].salesManID;
                    g2.glComments = obj1[0].glComments;
                    g2.instituteOffer = 0;
                    g2.debitSum = obj1[0].creditSum + obj1[0].taxSum;
                    g2.taxSum = 0;
                    g2.cstID = obj1[0].cstID;
                    g2.dtTx = obj1[0].dtTx;
                    g2.paidSum = 0;
                    g2.discountSum = 0;
                    g2.glComments = string.Empty;
                    g2.salesManID = obj1[0].salesManID;
                    g2.glComments = obj1[0].glComments;
                    g2.crtBy = g2.modBy = obj1[0].crtBy;
                    g2.isPaid = false;
                    g2.isVoided = false;
                    g2.isDeposited = false;
                    g2.isCleared = false;
                    g2.locID = obj1[0].locID;
                    g2.comID = obj1[0].comID;
                    glLt.Add(g2);
                }
            }


            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.cstID = obj1[0].cstID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.creditSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.debitSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.locID = obj1[0].locID;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.comID = obj1[0].comID;

            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);

            return glLt;
            #endregion

        }

        [NonAction]
        public List<GL> SaveSalesReturn(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            glPurchaseInvUpdLst = new List<GL>();
            gltxLnks = new GLTxLinks();
            gltxLinksUpdated = new List<GLTxLinks>();
            gltxLinksDelete = new List<GLTxLinks>();
            //137
            var saleReturnAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleReturn);
            //80
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);
            int accountID = 40;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            if (!isEdit) { gltxLinksLstSD = new List<GLTxLinks>(); }


            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (accountID == 40)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion

            #region -------- Add Sale  products Entries -------

            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;
                    //ProductBarCodes prodbarcode = new ProductBarCodes();
                    //if (obj.prodCode != null && obj.prodCode.Length > 0)
                    //{
                    //    prodbarcode = prodbarcodesLst.Find(x => x.BarCode.ToLower().Trim() == obj.prodCode.ToLower().Trim());
                    //}

                    //if (prodbarcode == null || prodbarcode.ProdBCID < 1) { continue; }
                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                            else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                        }

                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.cstID = obj.cstID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 137;
                        pro1.relCOAID = accountID;
                        pro1.acctNo = saleReturnAccCode;
                        pro1.relAcctNo = cashOrCreditAccCode;
                        pro1.creditSum = 0; //obj.creditSum;
                        pro1.debitSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.qtyBal = pro1.qty + pro1.bonusQty;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = obj.crtDate;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.modDate = DateTime.Now;
                        pro1.glComments = obj.glComments;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;
                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }

                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion
                    }
                }
            }


            #endregion

            #region -------- GL Product Ledger Record ---------
            g2 = new GL();
            if (!isEdit)
            {
                if (!isGuest) { glMasterEntry.voucherID = ""; } //x.txID == 0 &&
                glMasterEntry.Clone(g2);
                g2.GLID = 0;
                g2.depositID = fiscalYear;
                g2.txTypeID = obj1[0].txTypeID;
                g2.COAID = accountID;
                g2.relCOAID = 98;
                g2.acctNo = cashOrCreditAccCode;
                g2.relAcctNo = stockInTradeAccCode;
                g2.creditSum = 0;
                g2.voucherNo = glMasterEntry.voucherNo;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                // if (Extensions.ApplyFreight()) { g2.balSum = txtNetAmount.Text.ToDecimal() - txtFreightCharges.Text.ToDecimal(); }
                g2.instituteOffer = 0;
            }
            else
            {
                g2 = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.acctNo == cashOrCreditAccCode);

                if (g2 == null)
                {
                    g2 = new GL();
                    g2.depositID = fiscalYear;
                    g2.txTypeID = obj1[0].txTypeID;
                    g2.creditSum = 0;
                    g2.COAID = accountID;
                    g2.relCOAID = 98;
                    g2.acctNo = cashOrCreditAccCode;
                    g2.relAcctNo = stockInTradeAccCode;
                    g2.voucherNo = obj1[0].voucherNo;
                    g2.salesManID = obj1[0].salesManID;
                    g2.isPaid = g2.isCleared = g2.isDeposited = g2.isVoided = false;
                    g2.instituteOffer = 0;
                    g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                    g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 98).GLID;
                    g2.modDate = DateTime.Now;
                    g2.glComments = "";
                }
            }

            if (g2 != null)
            {
                if (accountID == 40)
                {
                    var balAmount = g2.balSum;
                    g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
                }
                else
                {
                    g2.balSum = 0;
                }
                g2.creditSum = obj1[0].creditSum + obj1[0].taxSum;
                g2.taxSum = 0;
                g2.cstID = obj1[0].cstID;
                g2.dtTx = obj1[0].dtTx;
                g2.paidSum = 0;
                g2.discountSum = 0;
                g2.glComments = string.Empty;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.crtBy = g2.modBy = obj1[0].crtBy;
                g2.isPaid = false;
                g2.isVoided = false;
                g2.isDeposited = false;
                g2.isCleared = false;
                g2.locID = obj1[0].locID;
                g2.comID = obj1[0].comID;
            }
            glLt.Add(g2);


            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.cstID = obj1[0].cstID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.debitSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.creditSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.locID = obj1[0].locID;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.comID = obj1[0].comID;
            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);

            return glLt;

            #endregion
        }

        [NonAction]
        public List<GL> SaveService(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            glPurchaseInvUpdLst = new List<GL>();
            gltxLnks = new GLTxLinks();
            gltxLinksUpdated = new List<GLTxLinks>();
            gltxLinksDelete = new List<GLTxLinks>();
            //141
            var saleLocalAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleLocal);
            //80
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);
            int accountID = 40;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            if (!isEdit) { gltxLinksLstSD = new List<GLTxLinks>(); }

            #endregion


            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (accountID == 40)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion



            #region -------- Add Sale  products Entries -------

            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;

                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                            else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                        }

                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.cstID = obj.cstID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 141;
                        pro1.relCOAID = accountID;
                        pro1.acctNo = saleLocalAccCode;
                        pro1.relAcctNo = cashOrCreditAccCode;
                        pro1.creditSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.qtyBal = pro1.qty + pro1.bonusQty;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.discountSum = 0;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = obj.crtDate;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.modDate = DateTime.Now;
                        pro1.glComments = obj.glComments;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;
                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }

                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion

                    }
                }
            }


            #endregion

            #region -------- GL Product Ledger Record ---------
            g2 = new GL();
            if (!isEdit)
            {
                if (!isGuest) { glMasterEntry.voucherID = ""; }
                glMasterEntry.Clone(g2);
                g2.GLID = 0;
                g2.depositID = fiscalYear;
                g2.txTypeID = obj1[0].txTypeID;
                g2.COAID = accountID;
                g2.relCOAID = 141;
                g2.acctNo = cashOrCreditAccCode;
                g2.relAcctNo = saleLocalAccCode;
                g2.creditSum = 0;
                g2.voucherNo = glMasterEntry.voucherNo;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.instituteOffer = 0;
            }
            else
            {
                g2 = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == 40);

                if (g2 == null)
                {
                    g2 = new GL();
                    g2.depositID = fiscalYear;
                    g2.txTypeID = obj1[0].txTypeID;
                    g2.COAID = accountID;
                    g2.relCOAID = 141;
                    g2.acctNo = cashOrCreditAccCode;
                    g2.relAcctNo = saleLocalAccCode;
                    g2.creditSum = 0;
                    g2.voucherNo = obj1[0].voucherNo;
                    g2.salesManID = obj1[0].salesManID;
                    g2.isPaid = g2.isCleared = g2.isDeposited = g2.isVoided = false;
                    g2.instituteOffer = 0;
                    g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                    g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 141).GLID;
                    g2.modDate = DateTime.Now;
                    g2.glComments = "";
                }
            }

            if (g2 != null)
            {
                if (accountID == 40)
                {
                    var balAmount = g2.balSum;
                    g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
                }
                else
                {
                    g2.balSum = 0;
                }
                g2.debitSum = obj1[0].creditSum + obj1[0].taxSum;
                g2.taxSum = 0;
                g2.cstID = obj1[0].cstID;
                g2.dtTx = obj1[0].dtTx;
                g2.paidSum = 0;
                g2.discountSum = 0;
                g2.glComments = string.Empty;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.crtBy = g2.modBy = obj1[0].crtBy;
                g2.isPaid = false;
                g2.isVoided = false;
                g2.isDeposited = false;
                g2.isCleared = false;
                g2.locID = obj1[0].locID;
                g2.comID = obj1[0].comID;
            }
          
            glLt.Add(g2);


            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.cstID = obj1[0].cstID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.creditSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.debitSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.locID = obj1[0].locID;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.comID = obj1[0].comID;
            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);


            return glLt;
            #endregion
        }

        [NonAction]
        public List<GL> SavePurchase(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            glPurchaseInvUpdLst = new List<GL>();
            gltxLnks = new GLTxLinks();
            gltxLinksUpdated = new List<GLTxLinks>();
            gltxLinksDelete = new List<GLTxLinks>();
            //80 OR 83
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            
            int accountID = 83;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            if (!isEdit) { gltxLinksLstSD = new List<GLTxLinks>(); }

            #endregion


            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                vendID = obj1[0].vendID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (accountID == 83)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion


            #region -------- Add Sale  products Entries -------

               
            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.qtyBal = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;
                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0)
                            {
                                pro1.txID = glSaleDelList[0].GLID;
                                pro1.qtyBal = pro1.qty;
                            }
                            else
                            {
                                pro1.GLID = obj.GLID; pro1.txID = obj.txID;
                                pro1.qtyBal = pro1.qty - glSaleDelList.Find(x => x.COAID == 98 && x.prodID == obj.prodID).qty;
                            }
                        }

                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.vendID = obj.vendID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 98;
                        pro1.relCOAID = accountID;
                        pro1.acctNo = stockInTradeAccCode;
                        pro1.relAcctNo = cashOrCreditAccCode;
                        pro1.acctBal = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.debitSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.qtyBal = pro1.qty;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = obj.crtDate;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.modDate = DateTime.Now;
                        pro1.glComments = obj.glComments;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;
                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }

                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion

                    }
                }
            }


            #endregion

            #region -------- GL Product Ledger Record ---------
            g2 = new GL();
            if (!isEdit)
            {
                if (!isGuest) { glMasterEntry.voucherID = ""; } //x.txID == 0 &&
                glMasterEntry.Clone(g2);
                g2.GLID = 0;
                g2.depositID = fiscalYear;
                g2.txTypeID = obj1[0].txTypeID;
                g2.creditSum = 0;
                g2.COAID = accountID;
                g2.relCOAID = 98;
                g2.acctNo = cashOrCreditAccCode;
                g2.relAcctNo = stockInTradeAccCode;
                g2.voucherNo = glMasterEntry.voucherNo;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                // if (Extensions.ApplyFreight()) { g2.balSum = txtNetAmount.Text.ToDecimal() - txtFreightCharges.Text.ToDecimal(); }
                g2.instituteOffer = 0;
            }
            else
            {
                g2 = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == 83);

                if (g2 == null)
                {
                    g2 = new GL();
                    g2.depositID = fiscalYear;
                    g2.txTypeID = obj1[0].txTypeID;
                    g2.COAID = accountID;
                    g2.relCOAID = 98;
                    g2.acctNo = cashOrCreditAccCode;
                    g2.relAcctNo = stockInTradeAccCode;
                    g2.creditSum = 0;
                    g2.voucherNo = obj1[0].voucherNo;
                    g2.salesManID = obj1[0].salesManID;
                    g2.isPaid = g2.isCleared = g2.isDeposited = g2.isVoided = false;
                    g2.instituteOffer = 0;
                    g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                    g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 98).GLID;
                    g2.modDate = DateTime.Now;
                    g2.glComments = "";
                }
            }

            if (g2 != null)
            {
                if (accountID == 83)
                {
                    var balAmount = g2.balSum;
                    g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
                }
                else
                {
                    var balAmount = g2.balSum;
                    g2.balSum = 0;
                }
                g2.creditSum = obj1[0].creditSum + obj1[0].taxSum;
                g2.taxSum = 0;
                g2.vendID = obj1[0].vendID;
                g2.dtTx = obj1[0].dtTx;
                g2.paidSum = 0;
                g2.discountSum = 0;//((obj1[0].creditSum / 100) * obj1[0].discountSum);
                g2.glComments = string.Empty;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.crtBy = g2.modBy = obj1[0].crtBy;
                g2.isPaid = false;
                g2.isVoided = false;
                g2.isDeposited = false;
                g2.isCleared = false;
                g2.locID = obj1[0].locID;
                g2.comID = obj1[0].comID;
            }
            glLt.Add(g2);


            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.vendID = obj1[0].vendID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.creditSum = 0; //obj1[0].creditSum;
            tax.debitSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.locID = obj1[0].locID;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.comID = obj1[0].comID;

            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);

            return glLt;

            #endregion
        }

        [NonAction]
        public List<GL> SavePurchaseReturn(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            glPurchaseInvUpdLst = new List<GL>();
            gltxLnks = new GLTxLinks();
            gltxLinksUpdated = new List<GLTxLinks>();
            gltxLinksDelete = new List<GLTxLinks>();
            //141
            var saleLocalAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleLocal);
            //80 OR 83
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);
            int accountID = 83;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }

            if (!isEdit) { gltxLinksLstSD = new List<GLTxLinks>(); }

            #endregion


            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                vendID = obj1[0].vendID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""

            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (accountID == 83)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion


           

            #region -------- Add Sale  products Entries -------
            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.qtyBal = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;
                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                            else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                        }

                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.vendID = obj.vendID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 98;
                        pro1.relCOAID = accountID;
                        pro1.acctNo = stockInTradeAccCode;
                        pro1.relAcctNo = cashOrCreditAccCode;
                        pro1.acctBal = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.creditSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = obj.crtDate;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.modDate = DateTime.Now;
                        pro1.glComments = obj.glComments;
                        pro1.qty = -obj.qty; //row.Cells[4].Value.ToDecimal();
                        pro1.qtyBal = pro1.qty;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;

                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }

                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion
                    }
                }
            }


            #endregion
            #region -------- GL Product Ledger Record ---------
            g2 = new GL();
            if (!isEdit)
            {
                if (!isGuest) { glMasterEntry.voucherID = ""; } //x.txID == 0 &&
                glMasterEntry.Clone(g2);
                g2.GLID = 0;
                g2.depositID = fiscalYear;
                g2.txTypeID = obj1[0].txTypeID;
                g2.COAID = accountID;
                g2.relCOAID = 98;
                g2.acctNo = cashOrCreditAccCode;
                g2.relAcctNo = stockInTradeAccCode;
                g2.creditSum = 0;
                g2.voucherNo = glMasterEntry.voucherNo;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                // if (Extensions.ApplyFreight()) { g2.balSum = txtNetAmount.Text.ToDecimal() - txtFreightCharges.Text.ToDecimal(); }
                g2.instituteOffer = 0;
            }
            else
            {
                g2 = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == 83);

                if (g2 == null)
                {
                    g2 = new GL();
                    g2.depositID = fiscalYear;
                    g2.txTypeID = obj1[0].txTypeID;
                    g2.COAID = accountID;
                    g2.relCOAID = 98;
                    g2.acctNo = cashOrCreditAccCode;
                    g2.relAcctNo = stockInTradeAccCode;
                    g2.creditSum = 0;
                    g2.voucherNo = obj1[0].voucherNo;
                    g2.salesManID = obj1[0].salesManID;
                    g2.isPaid = g2.isCleared = g2.isDeposited = g2.isVoided = false;
                    g2.instituteOffer = 0;
                    g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                    g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.relCOAID == 98).GLID;
                    g2.modDate = DateTime.Now;
                    g2.glComments = "";
                }
            }

            if (g2 != null)
            {
                if (accountID == 83)
                {
                    var balAmount = g2.balSum;
                    g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
                }
                else
                {
                    g2.balSum = 0;
                }
                g2.debitSum = obj1[0].creditSum + obj1[0].taxSum;
                g2.taxSum = 0;
                g2.vendID = obj1[0].vendID;
                g2.dtTx = obj1[0].dtTx;
                g2.paidSum = 0;
                g2.discountSum = 0;//((obj1[0].creditSum / 100) * obj1[0].discountSum);
                g2.glComments = string.Empty;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.crtBy = g2.modBy = obj1[0].crtBy;
                g2.isPaid = false;
                g2.isVoided = false;
                g2.isDeposited = false;
                g2.isCleared = false;
                g2.locID = obj1[0].locID;
                g2.comID = obj1[0].comID;
            }
         
            glLt.Add(g2);


            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.vendID = obj1[0].vendID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.creditSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.debitSum = 0; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.locID = obj1[0].locID;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.comID = obj1[0].comID;
            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);

            return glLt;
            #endregion
        }

        [NonAction]
        public List<GL> SaveQutation(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            //141
            var saleLocalAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.SaleLocal);
            //80 OR 40
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeDebtors);
            //93
            var goodsPayableAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.GoodsPayable);
            //81
            var costOfGoodsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CostOfGoodsSold);
            int accountID = 40;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }
            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (!isEdit)
            {
                glMasterEntry.GLID = 0;
            }
            else
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            if (accountID == 40)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            glLt.Add(glMasterEntry);
            #endregion


            #region -------- Add Sale  products Entries -------
               
            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;
                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                            else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                        }
                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.cstID = obj.cstID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 93;
                        pro1.relCOAID = 141;
                        pro1.acctNo = goodsPayableAccCode;
                        pro1.relAcctNo = saleLocalAccCode;
                        pro1.creditSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.qtyBal = pro1.qty + pro1.bonusQty;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = pro1.modDate = DateTime.Now;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.glComments = obj.glComments;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;
                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }
                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion
                    }
                }
            }


            #endregion


            #region -------- GL Product Ledger Record ---------
            g2 = new GL();
            if (!isEdit)
            {
                if (!isGuest) { glMasterEntry.voucherID = ""; } //x.txID == 0 &&
                glMasterEntry.Clone(g2);
                g2.GLID = 0;
                g2.depositID = fiscalYear;
                g2.txTypeID = obj1[0].txTypeID;
                g2.COAID = 141;
                g2.relCOAID = 93;
                g2.acctNo = saleLocalAccCode;
                g2.relAcctNo = goodsPayableAccCode;
                g2.creditSum = 0;
                g2.voucherNo = glMasterEntry.voucherNo;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                // if (Extensions.ApplyFreight()) { g2.balSum = txtNetAmount.Text.ToDecimal() - txtFreightCharges.Text.ToDecimal(); }
                g2.instituteOffer = 0;
            }
            else
            {
                g2 = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == 141);

                if (g2 == null)
                {
                    g2 = new GL();
                    g2.depositID = fiscalYear;
                    g2.txTypeID = obj1[0].txTypeID;
                    g2.COAID = 141;
                    g2.relCOAID = 93;
                    g2.acctNo = saleLocalAccCode;
                    g2.relAcctNo = goodsPayableAccCode;
                    g2.creditSum = 0;
                    g2.voucherNo = obj1[0].voucherNo;
                    g2.salesManID = obj1[0].salesManID;
                    g2.isPaid = g2.isCleared = g2.isDeposited = g2.isVoided = false;
                    g2.instituteOffer = 0;
                    g2.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
                    g2.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == 141).GLID;
                    g2.modDate = DateTime.Now;
                    g2.glComments = "";
                    g2.locID = obj1[0].locID;

                }
            }

            if (g2 != null)
            {
                if (accountID == 40)
                {
                    g2.balSum = obj1[0].creditSum + obj1[0].taxSum - obj1[0].discountSum; //g2.balSum = txtBalance.Text.ToDecimal();
                }
                else
                {
                    g2.balSum = 0;
                }
                g2.debitSum = obj1[0].creditSum + obj1[0].taxSum;
                g2.taxSum = 0;
                g2.cstID = obj1[0].cstID;
                g2.dtTx = obj1[0].dtTx;
                g2.paidSum = 0;
                g2.discountSum = 0;
                g2.glComments = string.Empty;
                g2.salesManID = obj1[0].salesManID;
                g2.glComments = obj1[0].glComments;
                g2.crtBy = g2.modBy = obj1[0].crtBy;
                g2.isVoided = false;
                g2.isPaid = false;
                g2.isDeposited = false;
                g2.isCleared = false;
                g2.locID = obj1[0].locID;
                g2.comID = obj1[0].comID;
            }
          
            glLt.Add(g2);


            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.cstID = obj1[0].cstID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.creditSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.debitSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.crtDate = tax.modDate = DateTime.Now;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.locID = obj1[0].locID;
            tax.comID = obj1[0].comID;
            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);

            return glLt;
            #endregion

        }

        [NonAction]
        public List<GL> SavePurchaseOrder(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            //80 OR 83
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);
            //98
            var stockInTradeAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.StockInTrade);
            //128
            var goodsReceivableAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.GoodsReceivable);

            int accountID = 83;
            if (obj1[0].type == "Cash")
            {
                accountID = 80;
                cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            }


            #endregion


            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                txTypeID = obj1[0].txTypeID,
                vendID = obj1[0].vendID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = obj1[0].discountSum,
                taxSum = obj1[0].taxSum,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                locID = obj1[0].locID,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isGuest) { glMasterEntry.isDeposited = true; }
            if (accountID == 83)
            {
                glMasterEntry.balSum = obj1[0].creditSum + obj1[0].taxSum; //g2.balSum = txtBalance.Text.ToDecimal();
            }
            else
            {
                glMasterEntry.balSum = 0;
            }
            if (isEdit)
            {
                glMasterEntry.GLID = glSaleDelList[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion


            #region -------- Add Sale  products Entries -------
               
            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.glComments = obj.glComments;
                    pro1.taxSum = 0;
                    if (pro1.prodID > 0 && pro1.qty > 0)
                    {
                        #region ------ Sale Delivery Product 1 Entry -------
                        if (!isEdit)
                        {
                            pro1.GLID = 0;
                        }
                        else
                        {
                            if (obj.GLID == 0) { pro1.txID = glSaleDelList[0].GLID; }
                            else { pro1.GLID = obj.GLID; pro1.txID = obj.txID; }
                        }

                        pro1.dtTx = obj.dtTx;
                        pro1.depositID = fiscalYear;
                        pro1.vendID = obj.vendID;
                        pro1.salesManID = obj.salesManID;
                        pro1.COAID = 128;
                        pro1.relCOAID = accountID;
                        pro1.acctNo = goodsReceivableAccCode;
                        pro1.relAcctNo = cashOrCreditAccCode;
                        pro1.debitSum = obj.qty * obj.unitPrice; //obj.creditSum;
                        pro1.qtyBal = pro1.qty + pro1.bonusQty;
                        pro1.txTypeID = obj1[0].txTypeID;
                        pro1.batchNo = obj.batchNo;
                        pro1.expiry = obj.expiry;
                        pro1.claim = obj.claim;
                        pro1.isPaid = false;
                        pro1.isVoided = false;
                        pro1.isDeposited = false;
                        pro1.isCleared = false;
                        pro1.tradeOffer = obj.tradeOffer;
                        pro1.creditOffer = obj.creditOffer;
                        pro1.bonusSum = obj.bonusSum;
                        pro1.voidedSum = obj.voidedSum;
                        pro1.taxSum = 0;
                        pro1.checkName = obj.checkName;
                        pro1.crtDate = pro1.modDate = DateTime.Now;
                        pro1.crtBy = pro1.modBy = obj.crtBy;
                        pro1.glComments = obj.glComments;
                        pro1.locID = obj.locID;
                        pro1.comID = obj.comID;
                        pro1.discountSum = obj.paidSum;
                        pro1.checkNo = obj.checkNo;
                        if (!isEdit) { pro1.voucherNo = glMasterEntry.voucherNo; pro1.voucherID = obj.voucherNo; }
                        else { pro1.voucherNo = obj.voucherNo; }
                        totalQty += pro1.qty;

                        totalDiscount += pro1.discountSum;
                        glLt.Add(pro1);
                        #endregion
                    }
                }
            }


            #endregion

            tax = new GL();
            if (!isEdit)
            {
                tax.GLID = 0;
            }
            else
            {
                tax.GLID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo && x.COAID == taxID).GLID;
                tax.txID = glSaleDelList.Find(x => x.voucherNo == obj1[0].voucherNo).GLID;
            }

            tax.dtTx = obj1[0].dtTx;
            tax.depositID = fiscalYear;
            tax.vendID = obj1[0].vendID;
            tax.salesManID = obj1[0].salesManID;
            tax.COAID = taxID;
            tax.relCOAID = accountID;
            tax.acctNo = taxAcctNo;
            tax.relAcctNo = cashOrCreditAccCode;
            tax.debitSum = obj1[0].taxSum; //obj1[0].creditSum;
            tax.qtyBal = 0;
            tax.txTypeID = obj1[0].txTypeID;
            tax.batchNo = obj1[0].batchNo;
            tax.expiry = obj1[0].expiry;
            tax.claim = obj1[0].claim;
            tax.isPaid = false;
            tax.isVoided = false;
            tax.isDeposited = false;
            tax.isCleared = false;
            tax.checkNo = string.Empty;
            tax.tradeOffer = obj1[0].tradeOffer;
            tax.creditOffer = obj1[0].creditOffer;
            tax.bonusSum = 0;
            tax.discountSum = 0;
            tax.voidedSum = 0;
            tax.creditSum = 0;
            tax.taxSum = 0;
            tax.checkName = "tax";
            tax.crtDate = tax.modDate = DateTime.Now;
            tax.crtBy = tax.modBy = obj1[0].crtBy;
            tax.glComments = obj1[0].glComments;
            tax.voucherNo = obj1[0].voucherNo;
            tax.locID = obj1[0].locID;
            tax.comID = obj1[0].comID;
            if (!isEdit) { tax.crtDate = tax.modDate = DateTime.Now; tax.voucherNo = glMasterEntry.voucherNo; tax.voucherID = obj1[0].voucherNo; }
            else { tax.modDate = DateTime.Now; }

            glLt.Add(tax);

            return glLt;

        }
        [NonAction]
        public List<GL> SavePayment(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            
            var tradeCreditorsAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.TradeCreditors);
            
            
            #endregion


            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                COAID = 0,
                relCOAID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = 0,
                vendID = obj1[0].vendID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = 0,
                taxSum = 0,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isEdit)
            {
                glMasterEntry.GLID = obj1[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion

            #region -------- Add Sale  products Entries -------

            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.taxSum = 0;
                    pro1.comID = obj.comID;
                    #region ------ Sale Delivery Product 1 Entry -------
                    if (!isEdit)
                    {
                        pro1.GLID = 0;
                    }
                    else
                    {
                        pro1.GLID = _AMDbContext.gl.Where(x => x.txID == obj.GLID && x.relCOAID == obj.COAID).ToList()[0].GLID;
                        pro1.txID = obj.GLID;
                    }
                    pro1.dtTx = obj.dtTx;
                    pro1.depositID = fiscalYear;
                    pro1.cstID = 0;
                    pro1.vendID = obj.vendID;
                    pro1.salesManID = obj.salesManID;
                    pro1.COAID = obj.relCOAID;
                    pro1.relCOAID = obj.COAID;
                    pro1.acctNo = obj.acctNo;
                    pro1.relAcctNo = tradeCreditorsAccCode;
                    pro1.creditSum = obj.creditSum; //obj.creditSum;
                    pro1.debitSum = 0; //obj.creditSum;
                    pro1.qtyBal = 0;
                    pro1.txTypeID = obj1[0].txTypeID;
                    pro1.batchNo = obj.batchNo;
                    pro1.expiry = obj.expiry;
                    pro1.claim = obj.claim;
                    pro1.isPaid = false;
                    pro1.isVoided = false;
                    pro1.isDeposited = false;
                    pro1.isCleared = false;
                    pro1.checkNo = string.Empty;
                    pro1.tradeOffer = obj.tradeOffer;
                    pro1.creditOffer = obj.creditOffer;
                    pro1.bonusSum = 0;
                    pro1.discountSum = 0;
                    pro1.voidedSum = obj.voidedSum;
                    pro1.taxSum = 0;
                    pro1.checkName = obj.checkName;
                    pro1.crtDate = obj.crtDate;
                    pro1.modDate = obj.modDate;
                    pro1.crtBy = pro1.modBy = obj.crtBy;
                    pro1.glComments = obj.glComments;
                    pro1.voucherNo = obj.voucherNo;
                    glLt.Add(pro1);
                    #endregion



                    pro2 = new GL();
                    pro2.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro2.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro2.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro2.salesManID = obj.salesManID;
                    pro2.bookerID = obj.bookerID;
                    pro2.journalID = obj.journalID;
                    pro2.taxSum = 0;
                    pro2.comID = obj.comID;

                    #region ------ Sale Delivery Product 2 Entry -------

                    if (!isEdit)
                    {
                        pro2.GLID = 0;
                    }
                    else
                    {
                        pro2.GLID = _AMDbContext.gl.Where(x => x.txID == obj.GLID && x.COAID == obj.COAID).ToList()[0].GLID;
                        pro2.txID = obj.GLID;
                    }
                    pro2.dtTx = obj.dtTx;
                    pro2.depositID = fiscalYear;
                    pro2.cstID = 0;
                    pro2.vendID = obj.vendID;
                    pro2.salesManID = obj.salesManID;
                    pro2.COAID = obj.COAID;
                    pro2.relCOAID = obj.relCOAID;
                    pro2.acctNo = tradeCreditorsAccCode;
                    pro2.relAcctNo = obj.acctNo;
                    pro2.balSum = -obj.creditSum; //obj.creditSum;
                    pro2.creditSum = 0; //obj.creditSum;
                    pro2.debitSum = obj.creditSum; //obj.creditSum;
                    pro2.qtyBal = 0;
                    pro2.txTypeID = obj1[0].txTypeID;
                    pro2.batchNo = obj.batchNo;
                    pro2.expiry = obj.expiry;
                    pro2.claim = obj.claim;
                    pro2.isPaid = false;
                    pro2.isVoided = false;
                    pro2.isDeposited = false;
                    pro2.isCleared = false;
                    pro2.checkNo = string.Empty;
                    pro2.tradeOffer = obj.tradeOffer;
                    pro2.creditOffer = obj.creditOffer;
                    pro2.bonusSum = 0;
                    pro2.discountSum = 0;
                    pro2.voidedSum = obj.voidedSum;
                    pro2.taxSum = 0;
                    pro2.checkName = obj.checkName;
                    pro2.crtDate = obj.crtDate;
                    pro2.modDate = obj.modDate;
                    pro2.crtBy = pro2.modBy = obj.crtBy;
                    pro2.glComments = obj.glComments;
                    pro2.voucherNo = obj.voucherNo;
                    glLt.Add(pro2);
                    #endregion

                }
            }


            #endregion

            return glLt;

        }

        [NonAction]
        public List<GL> SaveJournal(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
        
            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                COAID = 0,
                relCOAID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = 0,
                discountSum = 0,
                taxSum = 0,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            glLt.Add(glMasterEntry);
            #endregion


            #region -------- Add Sale  products Entries -------

            List<GL> GLDetails = new List<GL>();
            decimal total = 0;
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    total += obj.creditSum;
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.taxSum = 0;
                    pro1.comID = obj.comID;
                    //ProductBarCodes prodbarcode = new ProductBarCodes();
                    //if (obj.prodCode != null && obj.prodCode.Length > 0)
                    //{
                    //    prodbarcode = prodbarcodesLst.Find(x => x.BarCode.ToLower().Trim() == obj.prodCode.ToLower().Trim());
                    //}

                    //if (prodbarcode == null || prodbarcode.ProdBCID < 1) { continue; }


                    #region ------ Sale Delivery Product 1 Entry -------
                    pro1.GLID = 0;
                    pro1.dtTx = obj.dtTx;
                    pro1.depositID = fiscalYear;
                    pro1.cstID = obj.cstID;
                    pro1.salesManID = obj.salesManID;
                    pro1.COAID = obj.COAID;
                    pro1.relCOAID = obj.relCOAID;
                    pro1.acctNo = obj.acctNo;
                    pro1.relAcctNo = obj.relAcctNo;
                    pro1.creditSum = obj.creditSum; //obj.creditSum;
                    pro1.debitSum = obj.debitSum; //obj.creditSum;
                    pro1.qtyBal = 0;
                    pro1.txTypeID = obj1[0].txTypeID;
                    pro1.batchNo = obj.batchNo;
                    pro1.expiry = obj.expiry;
                    pro1.claim = obj.claim;
                    pro1.isPaid = false;
                    pro1.isVoided = false;
                    pro1.isDeposited = false;
                    pro1.isCleared = false;
                    pro1.checkNo = string.Empty;
                    pro1.tradeOffer = obj.tradeOffer;
                    pro1.creditOffer = obj.creditOffer;
                    pro1.bonusSum = 0;
                    pro1.discountSum = 0;
                    pro1.voidedSum = obj.voidedSum;
                    pro1.taxSum = 0;
                    pro1.checkName = obj.checkName;
                    pro1.crtDate = pro1.modDate = DateTime.Now;
                    pro1.crtBy = pro1.modBy = obj.crtBy;
                    pro1.glComments = obj.glComments;
                    pro1.voucherNo = obj.voucherNo;
                    glLt.Add(pro1);
                    #endregion

                }
            }


            glMasterEntry.creditSum = total;
            #endregion

            return glLt;

        }

        [NonAction]
        public List<GL> SaveExpense(List<GL> obj1, string comment)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();
            var cashOrCreditAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashInHand);
            var CashAndBanksAccCode = _helperMethods.GetAcctNoByKey(ConfigKeys.CashAndBanks);
            
            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                COAID = 0,
                relCOAID = 0,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = 0,
                discountSum = 0,
                taxSum = 0,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = comment,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            glLt.Add(glMasterEntry);
            #endregion


            #region -------- Add Sale  products Entries -------

            List<GL> GLDetails = new List<GL>();
            decimal total = 0;
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    total += obj.creditSum;
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.taxSum = 0;
                    pro1.comID = obj.comID;
                    #region ------ Sale Delivery Product 1 Entry -------
                    pro1.GLID = 0;
                    pro1.dtTx = obj.dtTx;
                    pro1.depositID = fiscalYear;
                    pro1.cstID = obj.cstID;
                    pro1.salesManID = obj.salesManID;
                    pro1.COAID = obj.COAID;
                    pro1.relCOAID = obj.relCOAID;
                    pro1.acctNo = obj.COAID == 80 ? cashOrCreditAccCode : obj.acctNo;
                    pro1.relAcctNo = obj.COAID == 80? CashAndBanksAccCode : obj.relAcctNo;
                    pro1.creditSum = obj.creditSum; //obj.creditSum;
                    pro1.debitSum = obj.debitSum; //obj.creditSum;
                    pro1.qtyBal = 0;
                    pro1.txTypeID = obj1[0].txTypeID;
                    pro1.batchNo = obj.batchNo;
                    pro1.expiry = obj.expiry;
                    pro1.claim = obj.claim;
                    pro1.isPaid = false;
                    pro1.isVoided = false;
                    pro1.isDeposited = false;
                    pro1.isCleared = false;
                    pro1.checkNo = string.Empty;
                    pro1.tradeOffer = obj.tradeOffer;
                    pro1.creditOffer = obj.creditOffer;
                    pro1.bonusSum = 0;
                    pro1.discountSum = 0;
                    pro1.voidedSum = obj.voidedSum;
                    pro1.taxSum = 0;
                    pro1.checkName = obj.checkName;
                    pro1.crtDate = pro1.modDate = DateTime.Now;
                    pro1.crtBy = pro1.modBy = obj.crtBy;
                    pro1.glComments = obj.glComments;
                    pro1.voucherNo = obj.voucherNo;
                    glLt.Add(pro1);
                    #endregion
                }
            }


            glMasterEntry.creditSum = total;
            #endregion

            return glLt;

        }

        [NonAction]
        public List<GL> SaveReceipt(List<GL> obj1)
        {
            #region ---- validation and variable initialzng ---
            GL pro1 = new GL();
            GL pro2 = new GL();
            GL pro3 = new GL();
            GL tax = new GL();
            GL g2 = new GL();
            GL glMasterEntry = new GL();
            List<GL> glLt = new List<GL>();

            #endregion

            #region ------- GL Master Sale Invoice Entry ------
            glMasterEntry = new GL
            {
                GLID = 0,
                COAID = obj1[0].COAID,
                relCOAID = obj1[0].relCOAID,
                txTypeID = obj1[0].txTypeID,
                cstID = obj1[0].cstID,
                depositID = fiscalYear,
                salesManID = obj1[0].salesManID,
                bookerID = obj1[0].bookerID,
                isDeposited = false,
                isVoided = false,
                isCleared = false,
                isPaid = false,
                voucherNo = obj1[0].voucherNo,
                instituteOffer = 0,
                creditSum = obj1[0].creditSum,
                discountSum = 0,
                taxSum = 0,
                paidSum = 0,
                dtTx = obj1[0].dtTx,
                empID = obj1[0].empID,
                checkNo = obj1[0].checkNo,
                checkAdd = obj1[0].checkAdd,
                glComments = obj1[0].glComments,
                crtBy = obj1[0].crtBy,
                crtDate = obj1[0].crtDate,
                modBy = obj1[0].modBy,
                modDate = obj1[0].modDate,
                checkName = obj1[0].checkName,
                comID = obj1[0].comID,
                acctNo = "",
                relAcctNo = ""
            };
            if (isEdit)
            {
                glMasterEntry.GLID = obj1[0].GLID;
            }
            glLt.Add(glMasterEntry);
            #endregion
            #region -------- Add Sale  products Entries -------

            List<GL> GLDetails = new List<GL>();
            foreach (GL obj in obj1)
            {
                GLDetails.Add(obj);
                if (GLDetails.Count > 0)
                {
                    pro1 = new GL();
                    pro1.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro1.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro1.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro1.salesManID = obj.salesManID;
                    pro1.bookerID = obj.bookerID;
                    pro1.journalID = obj.journalID;
                    pro1.taxSum = 0;
                    pro1.comID = obj.comID;

                    #region ------ Sale Delivery Product 1 Entry -------
                    if (!isEdit)
                        pro1.GLID = 0;
                    else
                    {
                        pro1.GLID = _AMDbContext.gl.Where(x => x.txID == obj.GLID && x.relCOAID == obj.COAID).ToList()[0].GLID;
                        pro1.txID = obj.GLID;
                    }
                    pro1.dtTx = obj.dtTx;
                    pro1.depositID = fiscalYear;
                    pro1.cstID = obj.cstID;
                    pro1.salesManID = obj.salesManID;
                    pro1.COAID = obj.relCOAID;
                    pro1.relCOAID = obj.COAID;
                    pro1.acctNo = obj.relAcctNo;
                    pro1.relAcctNo = obj.acctNo;
                    pro1.creditSum = 0; //obj.creditSum;
                    pro1.debitSum = obj.creditSum; //obj.creditSum;
                    pro1.qtyBal = 0;
                    pro1.txTypeID = obj1[0].txTypeID;
                    pro1.batchNo = obj.batchNo;
                    pro1.expiry = obj.expiry;
                    pro1.claim = obj.claim;
                    pro1.isPaid = false;
                    pro1.isVoided = false;
                    pro1.isDeposited = false;
                    pro1.isCleared = false;
                    pro1.checkNo = string.Empty;
                    pro1.tradeOffer = obj.tradeOffer;
                    pro1.creditOffer = obj.creditOffer;
                    pro1.bonusSum = 0;
                    pro1.discountSum = 0;
                    pro1.voidedSum = obj.voidedSum;
                    pro1.taxSum = 0;
                    pro1.checkName = obj.checkName;
                    pro1.crtDate = obj.crtDate;
                    pro1.modDate = obj.modDate;
                    pro1.crtBy = pro1.modBy = obj.crtBy;
                    pro1.glComments = obj.glComments;
                    pro1.voucherNo = obj.voucherNo;
                    glLt.Add(pro1);
                    #endregion



                    pro2 = new GL();
                    pro2.prodID = obj.prodID; //row.Cells[1].Value.ToInt32();
                    pro2.qty = obj.qty; //row.Cells[4].Value.ToDecimal();
                    pro2.unitPrice = obj.unitPrice; //row.Cells[6].Value.ToDecimal();
                    pro2.salesManID = obj.salesManID;
                    pro2.bookerID = obj.bookerID;
                    pro2.journalID = obj.journalID;
                    pro2.taxSum = 0;
                    pro2.comID = obj.comID;

                    #region ------ Sale Delivery Product 2 Entry -------

                    if (!isEdit)
                        pro2.GLID = 0;
                    else
                    {
                        pro2.GLID = _AMDbContext.gl.Where(x => x.txID == obj.GLID && x.COAID == obj.COAID).ToList()[0].GLID;
                        pro2.txID = obj.GLID;
                    }
                    pro2.dtTx = obj.dtTx;
                    pro2.depositID = fiscalYear;
                    pro2.cstID = obj.cstID;
                    pro2.salesManID = obj.salesManID;
                    pro2.COAID = obj.COAID;
                    pro2.relCOAID = obj.relCOAID;
                    pro2.acctNo = obj.acctNo;
                    pro2.relAcctNo = obj.relAcctNo;
                    pro2.balSum = -obj.creditSum; //obj.creditSum;
                    pro2.creditSum = obj.creditSum; //obj.creditSum;
                    pro2.debitSum = 0; //obj.creditSum;
                    pro2.qtyBal = 0;
                    pro2.txTypeID = obj1[0].txTypeID;
                    pro2.batchNo = obj.batchNo;
                    pro2.expiry = obj.expiry;
                    pro2.claim = obj.claim;
                    pro2.isPaid = false;
                    pro2.isVoided = false;
                    pro2.isDeposited = false;
                    pro2.isCleared = false;
                    pro2.checkNo = string.Empty;
                    pro2.tradeOffer = obj.tradeOffer;
                    pro2.creditOffer = obj.creditOffer;
                    pro2.bonusSum = 0;
                    pro2.discountSum = 0;
                    pro2.voidedSum = obj.voidedSum;
                    pro2.taxSum = 0;
                    pro2.checkName = obj.checkName;
                    pro2.crtDate = obj.crtDate;
                    pro2.modDate = obj.modDate;
                    pro2.crtBy = pro2.modBy = obj.crtBy;
                    pro2.glComments = obj.glComments;
                    pro2.voucherNo = obj.voucherNo;
                    glLt.Add(pro2);

                    #endregion

                }
            }


            #endregion
            return glLt;
        }

    }
}

