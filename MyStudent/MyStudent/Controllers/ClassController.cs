using Microsoft.AspNetCore.Mvc;

namespace MyStudent.Controllers
{
    public class ClassController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
