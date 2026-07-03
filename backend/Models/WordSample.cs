namespace MemoryApp.Api.Models;

public class WordSample
{
    public int WordSampleId { get; set; }
    public int WordId { get; set; }
    public Word? Word { get; set; }
    public string Sample { get; set; } = string.Empty;
}
