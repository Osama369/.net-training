using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;

namespace eMaestroD.Api.Controllers
{
    [ApiController]
    [Authorize]
    [Route("/api/[controller]")]
    public class OfferController : Controller
    {
        private readonly AMDbContext _AMDbContext;

        public OfferController(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }

        // Get all offers
        [HttpGet("{comID}")]
        public async Task<IActionResult> GetOffers(int comID)
        {
            var offers = _AMDbContext.Offers.Where(x=>x.comID == comID).ToList();
            var response = new ResponsedGroupListVM
            {
                enttityDataSource = offers,
                entityModel = offers?.GetEntity_MetaData()
            };
            return Ok(response);
        }

        // Add or Update (Upsert) an offer
        [HttpPost("upsert")]
        public async Task<IActionResult> UpsertOffer([FromBody] Offer offer)
        {
            if (offer.offerID == 0)
            {
                _AMDbContext.Offers.Add(offer);
            }
            else
            {
                var existingOffer = await _AMDbContext.Offers.FindAsync(offer.offerID);
                if (existingOffer != null)
                {
                    existingOffer.offerName = offer.offerName;
                    existingOffer.offerType = offer.offerType;
                    existingOffer.offerDescr = offer.offerDescr;
                    existingOffer.modBy = offer.modBy;
                    existingOffer.modDate = offer.modDate;
                    existingOffer.active = offer.active;
                    existingOffer.comID = offer.comID;
                    _AMDbContext.Offers.Update(existingOffer);
                }
                else
                {
                    return NotFound();
                }
            }

            await _AMDbContext.SaveChangesAsync();
            return Ok(offer);
        }

        // Delete an offer
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteOffer(int id)
        {
            var offer = await _AMDbContext.Offers.FindAsync(id);
            if (offer == null)
            {
                return NotFound();
            }

            _AMDbContext.Offers.Remove(offer);
            await _AMDbContext.SaveChangesAsync();
            return Ok();
        }
    }
}
