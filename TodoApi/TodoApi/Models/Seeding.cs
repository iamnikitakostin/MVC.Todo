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
                    IsCompleted = false
                },
                new Todo
                {
                    Name = "Buy eggs",
                    IsCompleted = false
                },
                new Todo
                {
                    Name = "Finish the project",
                    IsCompleted = true
                },
                new Todo
                {
                    Name = "Send email",
                    IsCompleted = false
                }
            );
            context.SaveChanges();
        }
    }
}
