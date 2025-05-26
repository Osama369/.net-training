using Microsoft.AspNetCore.Mvc;

namespace MyStudent.Controllers
{
    public class ErrorController : Controller
    {
        public IActionResult DbNotConnected()
        {
            return View(); // Views/Error/DbNotConnected.cshtml
        }
    }
}
