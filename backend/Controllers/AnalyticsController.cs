using MemoryApp.Api.Data;
using MemoryApp.Api.DTOs;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MemoryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AnalyticsController : ControllerBase
{
    private readonly MemoryAppDbContext _context;

    public AnalyticsController(MemoryAppDbContext context)
    {
        _context = context;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet("report")]
    public async Task<IActionResult> GetReport()
    {
        var progresses = await _context.UserWordProgresses
            .Include(p => p.Word)
            .Where(p => p.UserId == CurrentUserId && p.TotalAttempts > 0)
            .ToListAsync();

        var totalWordsStudied = progresses.Count;
        var totalMastered = progresses.Count(p => p.IsMastered);

        var topicBreakdown = progresses
            .Where(p => p.Word != null)
            .GroupBy(p => p.Word!.Topic ?? "Diğer")
            .Select(g =>
            {
                var totalAttempts = g.Sum(p => p.TotalAttempts);
                var totalCorrect = g.Sum(p => p.TotalCorrect);
                var percentage = totalAttempts == 0 ? 0 : Math.Round((double)totalCorrect / totalAttempts * 100, 1);
                return new TopicSuccessRate(g.Key, totalAttempts, totalCorrect, percentage);
            })
            .OrderByDescending(t => t.SuccessPercentage)
            .ToList();

        var response = new AnalyticsReportResponse(totalWordsStudied, totalMastered, topicBreakdown);
        return Ok(response);
    }
}
