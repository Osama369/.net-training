using Microsoft.AspNetCore.Mvc;

namespace Studentproject.Controllers
{
    public class EnrollmentController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
