using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

namespace eMaestroD.Api.Models
{
    public class RegisterBindingModel : IdentityUser
    {
        //public int tenantID { get; set; }
    }

    public class CustomUserManager : UserManager<RegisterBindingModel>
    {
        public CustomUserManager(
            IUserStore<RegisterBindingModel> store,
            IOptions<IdentityOptions> optionsAccessor,
            IPasswordHasher<RegisterBindingModel> passwordHasher,
            IEnumerable<IUserValidator<RegisterBindingModel>> userValidators,
            IEnumerable<IPasswordValidator<RegisterBindingModel>> passwordValidators,
            ILookupNormalizer keyNormalizer,
            IdentityErrorDescriber errors,
            IServiceProvider services,
            ILogger<UserManager<RegisterBindingModel>> logger)
            : base(store, optionsAccessor, passwordHasher, userValidators, passwordValidators, keyNormalizer, errors, services, logger)
        {
        }

        internal Task DeleteAsync(Task<RegisterBindingModel> user)
        {
            throw new NotImplementedException();
        }

        // Add your custom methods here

        //public List<RegisterBindingModel> FindByTenantIDAsync(int tenantID)
        //{
        //    return Users.Where(u => u.tenantID == tenantID).ToList();
        //}
    }
}