using MemoryApp.Api.Data;
using MemoryApp.Api.DTOs;
using MemoryApp.Api.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace MemoryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserSettingsController : ControllerBase
{
    private readonly MemoryAppDbContext _context;

    public UserSettingsController(MemoryAppDbContext context)
    {
        _context = context;
    }

    private string CurrentUserId => User.FindFirstValue(ClaimTypes.NameIdentifier)!;

    [HttpGet]
    public async Task<IActionResult> Get()
    {
        var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);

        if (settings == null)
        {
            settings = new UserSettings { UserId = CurrentUserId, DailyNewWordCount = 10 };
            _context.UserSettings.Add(settings);
            await _context.SaveChangesAsync();
        }

        return Ok(new UserSettingsResponse(settings.DailyNewWordCount));
    }

    [HttpPut]
    public async Task<IActionResult> Update(UpdateUserSettingsRequest request)
    {
        if (request.DailyNewWordCount < 1 || request.DailyNewWordCount > 100)
            return BadRequest(new { message = "Günlük yeni kelime sayısı 1 ile 100 arasında olmalı." });

        var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == CurrentUserId);

        if (settings == null)
        {
            settings = new UserSettings { UserId = CurrentUserId, DailyNewWordCount = request.DailyNewWordCount };
            _context.UserSettings.Add(settings);
        }
        else
        {
            settings.DailyNewWordCount = request.DailyNewWordCount;
        }

        await _context.SaveChangesAsync();
        return Ok(new UserSettingsResponse(settings.DailyNewWordCount));
    }
}
