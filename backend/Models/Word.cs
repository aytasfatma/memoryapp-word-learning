namespace MemoryApp.Api.Models;

public class Word
{
    public int WordId { get; set; }
    public string EngWordName { get; set; } = string.Empty;
    public string TurWordName { get; set; } = string.Empty;
    public string? Picture { get; set; }
    public string? AudioPath { get; set; }
    public string? Topic { get; set; }
    public string? MnemonicHint { get; set; }
    public List<WordSample> Samples { get; set; } = new();
}
