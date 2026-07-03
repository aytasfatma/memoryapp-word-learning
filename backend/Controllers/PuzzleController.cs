using MemoryApp.Api.DTOs;
using MemoryApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace MemoryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class PuzzleController : ControllerBase
{
    private readonly IPuzzleService _puzzleService;

    public PuzzleController(IPuzzleService puzzleService)
    {
        _puzzleService = puzzleService;
    }

    [HttpGet("match-game")]
    public async Task<IActionResult> GetMatchGame([FromQuery] int wordCount = 6)
    {
        var result = await _puzzleService.GetMatchGameAsync(wordCount);
        return Ok(result);
    }

    [HttpGet("anagram")]
    public async Task<IActionResult> GetAnagram([FromQuery] int wordCount = 5)
    {
        var result = await _puzzleService.GetAnagramsAsync(wordCount);
        return Ok(result);
    }

    [HttpGet("word-search")]
    public async Task<IActionResult> GetWordSearch([FromQuery] int wordCount = 5)
    {
        var result = await _puzzleService.GetWordSearchAsync(wordCount);
        return Ok(result);
    }
}
