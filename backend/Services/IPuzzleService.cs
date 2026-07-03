using MemoryApp.Api.DTOs;

namespace MemoryApp.Api.Services;

public interface IPuzzleService
{
    Task<MatchGameResponse> GetMatchGameAsync(int wordCount);
    Task<AnagramResponse> GetAnagramsAsync(int wordCount);
    Task<WordSearchResponse> GetWordSearchAsync(int wordCount);
}
