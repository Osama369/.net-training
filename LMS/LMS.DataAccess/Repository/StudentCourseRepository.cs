using LMS.DataAccess.DbSet;
using LMS.DataAccess.IRepository;
using LMS.Models.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace LMS.DataAccess.Repository
{
    public class StudentCourseRepository : IStudentCourseRepository
    {
        private readonly MyDbContext _context;

        public StudentCourseRepository(MyDbContext context)
        {
            _context = context;
        }

        public async Task AddStudentCourseAsync(int studentId, int courseId)
        {
            // Optional: Check if already exists to avoid duplicates
            var exists = await _context.StudentCourse
                .AnyAsync(sc => sc.StudentID == studentId && sc.CourseID == courseId);

            if (!exists)
            {
                var stdCourse = new StudentCourse
                {
                    StudentID = studentId,
                    CourseID = courseId
                };
                _context.StudentCourse.Add(stdCourse);
                await _context.SaveChangesAsync();
            }
        }

        public async Task<List<int>> GetCourseIdsForStudentAsync(int studentId)
        {
            return await _context.StudentCourse
                .Where(sc => sc.StudentID == studentId)
                .Select(sc => sc.CourseID)
                .ToListAsync();
        }

        public async Task UpdateStudentCoursesAsync(int studentId, List<int> selectedCourseIds)
        {
            var existing = await _context.StudentCourse
                .Where(sc => sc.StudentID == studentId)
                .ToListAsync();

            // Remove unselected
            _context.StudentCourse.RemoveRange(
                existing.Where(sc => !selectedCourseIds.Contains(sc.CourseID))
            );

            // Add new selections
            var existingCourseIds = existing.Select(sc => sc.CourseID).ToHashSet();
            var newCourseLinks = selectedCourseIds
                .Where(courseId => !existingCourseIds.Contains(courseId))
                .Select(courseId => new StudentCourse
                {
                    StudentID = studentId,
                    CourseID = courseId
                });

            await _context.StudentCourse.AddRangeAsync(newCourseLinks);
            await _context.SaveChangesAsync();
        }
    }
}
