using eMaestroD.Api.Data;
using eMaestroD.Models.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using eMaestroD.DataAccess.DataSet;
using eMaestroD.Shared.Common;
using Microsoft.EntityFrameworkCore;

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

        [HttpPost("upsert")]
        public async Task<IActionResult> UpsertOffer([FromBody] Offer offer)
        {
            offer.offerName = offer.offerName.Trim();

            bool nameExists = await _AMDbContext.Offers
                .AnyAsync(o => o.offerID != offer.offerID
                            && o.offerName.ToLower() == offer.offerName.ToLower()
                            && o.comID == offer.comID);

            if (nameExists)
            {
                return BadRequest($"An offer with the name '{offer.offerName}' already exists.");
            }

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
                    existingOffer.modDate = DateTime.Now; 
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
