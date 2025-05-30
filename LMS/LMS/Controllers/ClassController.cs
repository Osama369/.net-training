using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    public class ClassController : Controller
    {
       
        public IActionResult Index()
        {
            return View();
        }
    }
}
