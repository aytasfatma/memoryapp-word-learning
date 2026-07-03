using Microsoft.AspNetCore.Http;

namespace MemoryApp.Api.DTOs;

public class CreateWordRequest
{
    public string EngWordName { get; set; } = string.Empty;
    public string TurWordName { get; set; } = string.Empty;
    public string? Topic { get; set; }
    public string? MnemonicHint { get; set; }
    public List<string> Samples { get; set; } = new();
    public IFormFile? Picture { get; set; }
    public IFormFile? Audio { get; set; }
}

public record WordResponse(int WordId, string EngWordName, string TurWordName, string? Picture, string? AudioPath, string? Topic, string? MnemonicHint, List<string> Samples);
