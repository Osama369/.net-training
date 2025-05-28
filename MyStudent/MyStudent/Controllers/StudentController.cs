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
        private readonly ICourseService _courseService;
        public StudentController(IStudentService _studentService, IClassService _classServices, ICourseService _courseService)
        {
            this._studentService = _studentService;
            this._classService = _classServices;
            this._courseService = _courseService;
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

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if(student == null)
            {
                return NotFound();
            }
            return View(student);
        }

        [HttpPost, ActionName("Delete")]

        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student ==null)
            {
                return NotFound();
            }
            await _studentService.RemoveStudentAsync(student);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Details(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student ==null)
            {
                return NotFound();
            }
            return View(student);
        }


        [HttpGet] 
        public async Task<IActionResult> Edit(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if(student == null)
            {
                return NotFound();
            }
            await PopulateClassesDropdown();
            return View(student);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, Student student)
        {
            if (id!=student.StudentID)
            {
                return BadRequest();

            }
            if (ModelState.IsValid)
            {
                await _studentService.UpdateStudentAsync(student);
                return RedirectToAction("Index");
            }
            await PopulateClassesDropdown();

            return View(student);
        }


        private async Task PopulateClassesDropdown()
        {
            var classes = await _classService.GetAllClassesAsync();
            var courses = await _courseService.GetAllCourseAsync();
            ViewBag.ClassesList = classes.Select(c => new SelectListItem
            {
                Value = c.ClassID.ToString(),
                Text = c.ClassName
            }).ToList();
            ViewBag.CoursesList = courses.Select(c => new SelectListItem
            {
                Value = c.CourseID.ToString(),
                Text = c.CourseTile
            }).ToList();
        }

    }
}
