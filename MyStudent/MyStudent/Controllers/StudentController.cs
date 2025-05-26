using Microsoft.AspNetCore.Mvc;
using MyStudent.Models.Models;
using MyStudent.Services.IServices;

namespace MyStudent.Controllers
{
    public class StudentController : Controller
    {
        private readonly IStudentService _studentService;

        public StudentController(IStudentService _studentService)
        {
            this._studentService = _studentService;
        }


        public async Task<IActionResult> Index() // all students List 
        {
          var students  = await _studentService.GetAllStudentsAsync();
            return View(students);
        }

        [HttpGet]
        public IActionResult Add()
        {
           return View();   
        }

        [HttpPost]
        public async Task<IActionResult> Add(Student student)
        {
            if (ModelState.IsValid) {
                await _studentService.AddStudentAsync(student);
                return RedirectToAction("Index");
            }
        
            return View(student);
        }
    }
}
