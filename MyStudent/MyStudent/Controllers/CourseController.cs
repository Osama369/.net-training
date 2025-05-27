using Microsoft.AspNetCore.Mvc;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;

namespace MyStudent.Controllers
{
    public class CourseController : Controller
    {

        // using the iservices instances here 
        private readonly ICourseService _courseService;

        public CourseController(ICourseService _courseService)
        {
            this._courseService = _courseService;
        }

        public async Task<IActionResult> Index() // will show all courses 
        {
            // getallcourse
         var courses =  await _courseService.GetAllCourseAsync();
            return View(courses);
        }


        // add course 

        [HttpGet]
        public IActionResult Add()
        {
            return View();
        }

        [HttpPost]

        public async Task<IActionResult> Add(Course crs)
        {
            if (ModelState.IsValid)
            {
                await _courseService.AddCourseAsync(crs);
                TempData["SuccessMessage"] = "Class added successfully!";

                return RedirectToAction("Index");
            }
            return View(crs);
        }




    }
}
