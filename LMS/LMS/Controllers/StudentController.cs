using LMS.Models.Models;
using LMS.Services.IService;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace MyStudent.Controllers
{
    public class StudentController : Controller
    {
        private readonly IStudentService _studentService;
        private readonly IClassService _classService;
        private readonly ICourseService _courseService;

        public StudentController(IStudentService studentService, IClassService classService, ICourseService courseService)
        {
            _studentService = studentService;
            _classService = classService;
            _courseService = courseService;
        }

        public async Task<IActionResult> Index()
        {
            var students = await _studentService.GetAllStudentsAsync();
            return View(students);
        }

        [HttpGet]
        public async Task<IActionResult> Add()
        {
            await PopulateDropdowns();
            return View();
        }

        [HttpPost]
        public async Task<IActionResult> Add(Student student)
        {
            if (ModelState.IsValid)
            {
                var addedStudent = await _studentService.AddStudentAsync(student);

                // Save selected course mappings
                if (student.SelectedCourseIds != null && student.SelectedCourseIds.Any()) // .count > 0
                {
                    foreach (var courseId in student.SelectedCourseIds)
                    {
                        await _studentService.AddStudentCourseAsync(addedStudent.StudentID, courseId);
                    }
                }

                return RedirectToAction("Index");
            }

            await PopulateDropdowns();
            return View(student);
        }

        [HttpGet]
        public async Task<IActionResult> Delete(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null) return NotFound();

            return View(student);
        }

        [HttpPost, ActionName("Delete")]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null) return NotFound();

            await _studentService.RemoveStudentAsync(student);
            return RedirectToAction("Index");
        }

        [HttpGet]
        public async Task<IActionResult> Details(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null) return NotFound();

            return View(student);
        }

        [HttpGet]
        public async Task<IActionResult> Edit(int id)
        {
            var student = await _studentService.GetStudentByIdAsync(id);
            if (student == null) return NotFound();

            // Populate selected course IDs
            student.SelectedCourseIds = await _studentService.GetCourseIdsForStudentAsync(id);

            await PopulateDropdowns();
            return View(student);
        }

        [HttpPost]
        public async Task<IActionResult> Edit(int id, Student student)
        {
            if (id != student.StudentID) return BadRequest();

            if (ModelState.IsValid)
            {
                await _studentService.UpdateStudentAsync(student);

                // Update student-course mappings
                await _studentService.UpdateStudentCoursesAsync(student.StudentID, student.SelectedCourseIds);

                return RedirectToAction("Index");
            }

            await PopulateDropdowns();
            return View(student);
        }

        private async Task PopulateDropdowns()
        {
            var classes = await _classService.GetAllClassesAsync();
            var courses = await _courseService.GetAllCoursesAsync();

            ViewBag.ClassesList = classes.Select(c => new SelectListItem
            {
                Value = c.ClassID.ToString(),
                Text = c.ClassName
            }).ToList();

            ViewBag.CoursesList = courses.Select(c => new SelectListItem
            {
                Value = c.CourseID.ToString(),
                Text = c.CourseTitle
            }).ToList();
        }
    }
}
