using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using MyAppModel;
using MyDb.DBOperation;
namespace myMvcapp.Controllers

{
    public class EmployeeController : Controller
    {
        EmployessRepository repository = null;

        public EmployeeController()
        {
            repository = new EmployessRepository();
        }

        [HttpGet]
        public ActionResult Overview()
           
        {
            var result = repository.GetAllEmpl();
            return View(result);
        }

        [HttpGet]

        public ActionResult Details(int id)
        {
            var result = repository.GetEmpl(id);
            return View(result);
        }   


        [HttpGet]
        public ActionResult Create()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Create(EmployeeModel empl)
        {
            if (ModelState.IsValid)
            {
                int id = repository.AddEmployee(empl);
                if (id > 0)
                {
                    ModelState.Clear();
                    ViewBag.Issuccess = "Data added successfully";
                    return RedirectToAction("Overview");
                }
            }

            return View();
        }

        [HttpGet]
        public ActionResult Edit(int id)  // here we get empl based on id 
        {
            var empl = repository.GetEmpl(id);
            return View(empl);
        }


        [HttpPost]
        public ActionResult Edit(EmployeeModel empl)  // here we get empl based on id 
        {
            if (ModelState.IsValid)
            {
                repository.UpdateEmpl(empl.Id, empl);
                return RedirectToAction("Overview");
            }
            return View(empl);
           
        }

        [HttpGet]

        public ActionResult Delete(int id)
        {
            repository.DeleteEmpl(id);
            return RedirectToAction("Overview");
        }

        protected override void Dispose(bool disposing)
        {
            if (disposing)
            {
                repository.Dispose();
            }
            base.Dispose(disposing);
        }


    }
}
