namespace MemoryApp.Api.Models;

public class UserWordProgress
{
    public int Id { get; set; }
    public string UserId { get; set; } = string.Empty;
    public int WordId { get; set; }
    public Word? Word { get; set; }
    public int ConsecutiveCorrectCount { get; set; }
    public int CurrentStageIndex { get; set; }
    public DateTime NextReviewDate { get; set; }
    public bool IsMastered { get; set; }
    public int TotalAttempts { get; set; }
    public int TotalCorrect { get; set; }
}
