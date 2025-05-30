using LMS.Models.Models;
using LMS.Services.IService;
using Microsoft.AspNetCore.Mvc;

namespace LMS.Controllers
{
    public class CourseController : Controller
    {
      //  private readonly IStudentService _studentService;
       //  private readonly IClassService _classService;
        private readonly ICourseService _courseService;

        public CourseController(IStudentService studentService , IClassService classService , ICourseService courseService )
        {
            //_studentService = studentService;
            //_classService = classService;
            _courseService = courseService;
        }

        public async Task<IActionResult> Index()
        {
            var courses =  await  _courseService.GetAllCoursesAsync();
            return View(courses);
        }


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
                return RedirectToAction("Index");
            }
            return View(crs);
        }

    }
}
