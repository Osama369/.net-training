using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using MyAppModel;

namespace MyDb.DBOperation
{ 
public class EmployessRepository : IDisposable   // this class will contains all the methods to add , delete , update functions 
{
        private readonly EmployeeDBEntities _context;  // instance of empldb class

        public EmployessRepository()
        {
            _context = new EmployeeDBEntities();
        }
    // 1. add employee 
        public int AddEmployee(EmployeeModel empl)
    {
        
            employees emp = new employees() // emp obhject contains data 
            {
                Name = empl.Name,            // data mapped 
                Designation = empl.Designation,
            };

            _context.employees.Add(emp);
            _context.SaveChanges();
            return emp.Id;
        
    }

        public void Dispose()
        {
           _context.Dispose();
        }
        // 2. delete employee

        public List<EmployeeModel> GetAllEmpl()
        {
           
              var result =  _context.employees.Select(e =>  new  EmployeeModel(){
                      Id = e.Id,
                      Name = e.Name,
                      Designation = e.Designation
                }).ToList();

               return result;
            
        }

        public EmployeeModel GetEmpl(int id)
        {
            
                var result = _context.employees.Where(x=> x.Id == id).Select(e => new EmployeeModel()
                {
                    Id = e.Id,
                    Name = e.Name,
                    Designation = e.Designation
                }).FirstOrDefault();

                return result;
            
        }

        public bool UpdateEmpl( int id , EmployeeModel empl )  // if updated true if not return false 
        {
            // kis record ko update krna h , or kia data update krna ha
           var employee = _context.employees.Find(id);
            if (employee != null)
            {
                employee.Name = empl.Name;
                employee.Designation = empl.Designation;

            }
            _context.SaveChanges();

            return true;
        }  


        public bool DeleteEmpl(int id)
        {
           var employee = _context.employees.FirstOrDefault(x=> x.Id ==id);
            if(employee != null)
            {
                _context.employees.Remove(employee);
                _context.SaveChanges();
                return true;
            }
            return false;
        }

    }
}
