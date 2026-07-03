using MemoryApp.Api.Data;
using MemoryApp.Api.DTOs;
using MemoryApp.Api.Models;
using MemoryApp.Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace MemoryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class WordsController : ControllerBase
{
    private readonly MemoryAppDbContext _context;
    private readonly IFileUploadService _fileUploadService;

    public WordsController(MemoryAppDbContext context, IFileUploadService fileUploadService)
    {
        _context = context;
        _fileUploadService = fileUploadService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var words = await _context.Words.Include(w => w.Samples).ToListAsync();
        var response = words.Select(w => new WordResponse(w.WordId, w.EngWordName, w.TurWordName, w.Picture, w.AudioPath, w.Topic, w.MnemonicHint, w.Samples.Select(s => s.Sample).ToList()));
        return Ok(response);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetById(int id)
    {
        var word = await _context.Words.Include(w => w.Samples).FirstOrDefaultAsync(w => w.WordId == id);
        if (word == null)
            return NotFound(new { message = "Kelime bulunamadı." });

        var response = new WordResponse(word.WordId, word.EngWordName, word.TurWordName, word.Picture, word.AudioPath, word.Topic, word.MnemonicHint, word.Samples.Select(s => s.Sample).ToList());
        return Ok(response);
    }

    [HttpPost]
    public async Task<IActionResult> Create([FromForm] CreateWordRequest request)
    {
        var picturePath = await _fileUploadService.SaveFileAsync(request.Picture, "words");
        var audioPath = await _fileUploadService.SaveFileAsync(request.Audio, "audio");

        var word = new Word
        {
            EngWordName = request.EngWordName,
            TurWordName = request.TurWordName,
            Topic = request.Topic,
            MnemonicHint = request.MnemonicHint,
            Picture = picturePath,
            AudioPath = audioPath,
            Samples = request.Samples.Select(s => new WordSample { Sample = s }).ToList()
        };

        _context.Words.Add(word);
        await _context.SaveChangesAsync();

        var response = new WordResponse(word.WordId, word.EngWordName, word.TurWordName, word.Picture, word.AudioPath, word.Topic, word.MnemonicHint, word.Samples.Select(s => s.Sample).ToList());
        return CreatedAtAction(nameof(GetById), new { id = word.WordId }, response);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> Delete(int id)
    {
        var word = await _context.Words.FindAsync(id);
        if (word == null)
            return NotFound(new { message = "Kelime bulunamadı." });

        _context.Words.Remove(word);
        await _context.SaveChangesAsync();
        return Ok(new { message = "Kelime silindi." });
    }
}
