using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;

namespace MyStudent.Controllers
{
    public class StudentController : Controller
    {
        private readonly IStudentService _studentService;
        private readonly IClassService  _classService;

        public StudentController(IStudentService _studentService, IClassService _classServices)
        {
            this._studentService = _studentService;
            this._classService = _classServices;
        }


        public async Task<IActionResult> Index() // all students List 
        {
          var students  = await _studentService.GetAllStudentsAsync();
            return View(students);
        }

        [HttpGet]
        public async Task<IActionResult> Add()
        {
            await PopulateClassesDropdown();

            return View();   
        }

        [HttpPost]
        public async Task<IActionResult> Add(Student student)
        {
            if (ModelState.IsValid) {
                await _studentService.AddStudentAsync(student);
                return RedirectToAction("Index");
            }

            await PopulateClassesDropdown();

            return View(student);
        }


        private async Task PopulateClassesDropdown()
        {
            var classes = await _classService.GetAllClassesAsync();
            ViewBag.ClassesList = classes.Select(c => new SelectListItem
            {
                Value = c.ClassID.ToString(),
                Text = c.ClassName
            }).ToList();
        }

    }
}
