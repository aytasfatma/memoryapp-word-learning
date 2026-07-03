using MemoryApp.Api.DTOs;
using MemoryApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace MemoryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class QuizController : ControllerBase
{
    private readonly IQuizService _quizService;

    public QuizController(IQuizService quizService)
    {
        _quizService = quizService;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("today")]
    public async Task<IActionResult> GetToday()
    {
        var questions = await _quizService.GetTodayQuestionsAsync(CurrentUserId);
        return Ok(questions);
    }

    [HttpPost("answer")]
    public async Task<IActionResult> SubmitAnswer(SubmitAnswerRequest request)
    {
        var result = await _quizService.SubmitAnswerAsync(CurrentUserId, request);
        return Ok(result);
    }
}
