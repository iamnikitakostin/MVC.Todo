using Microsoft.EntityFrameworkCore;

namespace TodoApi.Models;

public class Seeding
{
    public static void Initialize(IServiceProvider serviceProvider)
    {
        using (var context = new TodoContext(
            serviceProvider.GetRequiredService<DbContextOptions<TodoContext>>()))
        {
            if (context.Todos.Any()) {
                return;
            }
            context.Todos.AddRange(
                new Todo
                {
                    Name = "Throw out garbage",
                    IsCompleted = false,
                    Category = "Life",
                    IsReccuring = false,
                    ReccuringFrequencyInDays = 0,
                    DateCreated = DateTime.Now,
                    DateDeadline = DateTime.Now.AddDays(3),
                    Priority = 2
                },
                new Todo
                {
                    Name = "Buy eggs",
                    IsCompleted = false,
                    Category = "Life",
                    IsReccuring = false,
                    ReccuringFrequencyInDays = 0,
                    DateCreated = DateTime.Now,
                    DateDeadline = DateTime.Now.AddDays(3),
                    Priority = 2
                },
                new Todo
                {
                    Name = "Finish the project",
                    IsCompleted = true,
                    Category = "Job",
                    IsReccuring = false,
                    ReccuringFrequencyInDays = 0,
                    DateCreated = DateTime.Now,
                    DateDeadline = DateTime.Now.AddDays(3),
                    Priority = 3
                },
                new Todo
                {
                    Name = "Send email",
                    IsCompleted = false,
                    Category = "Job",
                    IsReccuring = false,
                    ReccuringFrequencyInDays = 0,
                    DateCreated = DateTime.Now,
                    DateDeadline = DateTime.Now.AddDays(3),
                    Priority = 3
                }
            );
            context.SaveChanges();
        }
    }
}
