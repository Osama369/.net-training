using Microsoft.AspNetCore.Mvc;
using Studentproject.Data;
using Studentproject.Models;

namespace Studentproject.Controllers
{
    public class StudentController : Controller
    { 
        private readonly MyAppContext myAppContext; // intance of Dbcontext class 
        private readonly IWebHostEnvironment _evn;    // will store file 
                                                      // istance of myappcotext
        public StudentController(MyAppContext _myAppContext , IWebHostEnvironment _evn) // initailised the myappcontext in controller constructor

        {
            myAppContext = _myAppContext;
            this._evn = _evn;
        }

        public IActionResult Overview()
        {
           // var rootPath = _evn.WebRootPath;
            var stdList = myAppContext.students.ToList();
            return View(stdList);
        }

        // Unified Add/Edit (Upsert) [POST]
        // POST: Handle Add or Edit
        [HttpPost]
        public IActionResult SaveStudent(Student std, IFormFile? ImageFile)
        {
            if (!ModelState.IsValid)
            {
                return View("UpsertStudent", std);
            }

            // Handle image upload
            if (ImageFile != null && ImageFile.Length > 0)
            {
                var rootPath = _evn.WebRootPath;
                var directoryPath = Path.Combine(rootPath, "Images");

                if (!Directory.Exists(directoryPath))
                    Directory.CreateDirectory(directoryPath);

                var uniqueFileName = Guid.NewGuid().ToString() + Path.GetExtension(ImageFile.FileName);
                var filePath = Path.Combine(directoryPath, uniqueFileName);

                using (var stream = new FileStream(filePath, FileMode.Create))
                {
                    ImageFile.CopyTo(stream);
                }

                std.url = "/Images/" + uniqueFileName;
            }

            if (std.Id == 0)
            {
                // Add new student
                myAppContext.students.Add(std);
            }
            else
            {
                // Edit existing student
                var existingStudent = myAppContext.students.Find(std.Id);
                if (existingStudent == null)
                    return NotFound();

                existingStudent.Name = std.Name;
                existingStudent.RollNumber = std.RollNumber;

                if (!string.IsNullOrEmpty(std.url))
                {
                    existingStudent.url = std.url; // Update image if uploaded
                }
            }

            myAppContext.SaveChanges();
            return RedirectToAction("Overview");
        }




        // delete the student
        [HttpPost]
        public IActionResult Delete(int id)
        {
            var std = myAppContext.students.Find(id);

            if (std == null)
            {
                return NotFound();
            }
            else
                myAppContext.students.Remove(std);
            myAppContext.SaveChanges();
            return RedirectToAction("Overview");
        }




        // GET: Show Upsert View for Add or Edit
        [HttpGet]
        public IActionResult UpsertStudent(int? id)
        {
            if (id == null || id == 0)
            {
                return View(new Student()); // Add
            }

            var std = myAppContext.students.Find(id);
            if (std == null)
            {
                return NotFound();
            }

            return View(std); // Edit
        }





    }


}
