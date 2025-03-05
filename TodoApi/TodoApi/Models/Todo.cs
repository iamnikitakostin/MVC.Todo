namespace TodoApi.Models;

public class Todo
{
    public int Id { get; set; }
    public string? Name { get; set; }
    public bool IsCompleted { get; set; }
    public DateTime DateCreated { get; set; }
    public DateTime DateDeadline { get; set; }
    public bool IsReccuring { get; set; }
    public int ReccuringFrequencyInDays {  get; set; }
    public string Category {  get; set; }
    public int Priority {  get; set; }
}
