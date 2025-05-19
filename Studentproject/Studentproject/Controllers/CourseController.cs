using Microsoft.AspNetCore.Mvc;
using Studentproject.Data;
using Studentproject.Models;

namespace Studentproject.Controllers
{
    public class CourseController : Controller
    {
        private readonly MyAppContext myAppContext;
       // private readonly IWebHostEnvironment _evn;    // to target env for system

        public CourseController(MyAppContext _myAppContext)
        {
            myAppContext = _myAppContext;
            //this._evn = _evn;
        }
        public IActionResult OverviewCourse()
        {
            //var rootPath = _evn.WebRootPath;
            
            var coursesList = myAppContext.courses.ToList();
            return View(coursesList);
        }


        // savecourse for edit and add course 
        [HttpPost]
        public IActionResult SaveCourse(Course course)
        {
            // model validating checking 
            if (!ModelState.IsValid)
            {
                return View("UpsertCourse",course);
            }

            if(course.Id == 0)  // agr course id 0 h to course add kro 
            {
                myAppContext.courses.Add(course);
            }

            else
            {
                // find the course by id exixting course 

                var existingCourse = myAppContext.courses.Find(course.Id);
                if (existingCourse != null)
                {
                   existingCourse.Title = course.Title;
                   course.Description = existingCourse.Description;
                }
            }
            myAppContext.SaveChanges();
            return RedirectToAction("OverviewCourse");
        }

        [HttpGet]
        public IActionResult AddCourse()
        {
            return View("UpsertCourse", new Course());
        }

      

        [HttpPost]

        public IActionResult Delete(int id)
        {
            // find the course by id
            var course = myAppContext.courses.Find(id);
            if (course == null)
            {
                return NotFound();
            }
            else
            {
                myAppContext.Remove(course);
                myAppContext.SaveChanges();
                return RedirectToAction("OverviewCourse");
            }
        }


        [HttpGet]
        public IActionResult EditCourse(int id)
        {
            var crs = myAppContext.courses.Find(id);
            if (crs == null)
            {
                return NotFound();
            }

            return View("UpsertCourse", crs);
        }




       


    }
}
