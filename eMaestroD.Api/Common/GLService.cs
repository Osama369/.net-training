using eMaestroD.Api.Data;
using eMaestroD.Api.Models;

namespace eMaestroD.Api.Common
{
    public class GLService
    {
        private readonly AMDbContext _AMDbContext;
        public GLService(AMDbContext aMDbContext)
        {
            _AMDbContext = aMDbContext;
        }
        public async Task InsertGLEntriesAsync<T>(IEnumerable<T> items, DateTime now, string username) where T : GL
        {
            using (var transaction = await _AMDbContext.Database.BeginTransactionAsync())
            {
                try
                {
                    int gl1 = 0;
                    foreach (var item in items)
                    {
                        item.crtDate = now;
                        item.crtBy = username;
                        item.modDate = now;
                        item.modBy = username;
                        if (gl1 != 0)
                        {
                            item.txID = gl1;
                        }
                        await _AMDbContext.Set<T>().AddAsync(item);
                        await _AMDbContext.SaveChangesAsync();
                        if (gl1 == 0)
                        {
                            gl1 = item.GLID;
                        }
                    }

                    await transaction.CommitAsync();
                }
                catch (Exception)
                {
                    await transaction.RollbackAsync();
                    throw;
                }
            }
        }
    }
}
