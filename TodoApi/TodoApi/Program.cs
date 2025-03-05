using Microsoft.EntityFrameworkCore;
using TodoApi.Models;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;


var builder = WebApplication.CreateBuilder(args);

string? connectionString = builder.Configuration.GetConnectionString("DefaultConnection");

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<TodoContext>(opt => opt.UseSqlServer(connectionString));

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var dbContext = scope.ServiceProvider.GetRequiredService<TodoContext>();
    dbContext.Database.EnsureCreated();
    dbContext.Database.Migrate();

    var services = scope.ServiceProvider;

    Seeding.Initialize(services);
}


//if (app.Environment.IsDevelopment())
//{
//    app.UseSwagger();
//    app.UseSwaggerUI();
//}

app.MapGet("/todoitems", async (TodoContext db) =>
{
    List<Todo> todos = await db.Todos.ToListAsync();

    foreach (Todo todo in todos)
    {
        if (todo.IsReccuring)
        {
            while (todo.DateDeadline.AddDays(todo.ReccuringFrequencyInDays) < DateTime.Now) {
                todo.DateDeadline.AddDays(todo.ReccuringFrequencyInDays);
            }

            db.Update(todo);
            await db.SaveChangesAsync();
        }
    }

    return todos;
});

app.MapGet("/todoitems/complete", async (TodoContext db) =>
    await db.Todos.Where(t => t.IsCompleted).ToListAsync());

app.Map("/todoitems/query={query}", async (string query, TodoContext db) => {
    List<Todo> todos = await db.Todos.Where(t => t.Name.Contains(query)).ToListAsync();
    return todos;
});

app.MapGet("/todoitems/{id}", async (int id, TodoContext db) =>
    await db.Todos.FindAsync(id)
        is Todo todo
            ? Results.Ok(todo)
            : Results.NotFound());

app.MapPost("/todoitems", async (Todo todo, TodoContext db) =>
{
    todo.DateCreated = DateTime.Now;

    db.Todos.Add(todo);
    await db.SaveChangesAsync();

    return Results.Created($"/todoitems/{todo.Id}", todo);
});

app.MapPut("/todoitems/{id}", async (int id, Todo todo, TodoContext db) =>
{
    Todo oldTodo = await db.Todos.FindAsync(id);

    if (oldTodo is null) return Results.NotFound();

    oldTodo.Name = todo.Name;
    oldTodo.IsCompleted = todo.IsCompleted;

    await db.SaveChangesAsync();

    return Results.NoContent();
});

app.MapDelete("/todoitems/{id}", async (int id, TodoContext db) =>
{
    if (await db.Todos.FindAsync(id) is Todo todo)
    {
        db.Todos.Remove(todo);
        await db.SaveChangesAsync();
        return Results.NoContent();
    }

    return Results.NotFound();
});

app.UseDefaultFiles();
app.UseStaticFiles(new StaticFileOptions
{
    OnPrepareResponse = ctx =>
    {
        ctx.Context.Response.Headers.Append("Cache-Control", "no-store, no-cache, must-revalidate");
    }
});


app.Run();