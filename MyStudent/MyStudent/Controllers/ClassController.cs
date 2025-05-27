using Microsoft.AspNetCore.Mvc;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;

namespace MyStudent.Controllers
{
    public class ClassController : Controller
      
    {
        private readonly IClassService _classService;

        // constructor to inject Di of services 
        public ClassController(IClassService _classService)
        {
             this._classService = _classService;
        }
        public async Task<IActionResult> Index()
        {
            var classes = await _classService.GetAllClassesAsync();
            return View(classes);
        }




        // Add action to add class 

        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }


        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Add(Class cls)
        {
            if (ModelState.IsValid)
            {
                await _classService.AddClassAsync(cls);
                TempData["SuccessMessage"] = "Class added successfully!";

                return RedirectToAction("Index");
            }
            return View(cls);
        }



    }
    }
