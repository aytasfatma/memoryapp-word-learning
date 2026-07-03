namespace MemoryApp.Api.Models;

public class UserSettings
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int DailyNewWordCount { get; set; } = 10;
}
