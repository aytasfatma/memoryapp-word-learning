using MemoryApp.Api.Data;
using MemoryApp.Api.DTOs;
using MemoryApp.Api.Models;
using Microsoft.EntityFrameworkCore;

namespace MemoryApp.Api.Services;

public class QuizService : IQuizService
{
    private static readonly int[] StageIntervalDays = { 1, 7, 30, 90, 180, 365 };
    private readonly MemoryAppDbContext _context;
    private readonly Random _random = new();

    public QuizService(MemoryAppDbContext context)
    {
        _context = context;
    }

    public async Task<List<QuizQuestionResponse>> GetTodayQuestionsAsync(string userId)
    {
        var today = DateTime.UtcNow.Date;

        var reviewProgress = await _context.UserWordProgresses
            .Include(p => p.Word)
            .Where(p => p.UserId == userId && !p.IsMastered && p.NextReviewDate <= today)
            .ToListAsync();

        var seenWordIds = await _context.UserWordProgresses
            .Where(p => p.UserId == userId)
            .Select(p => p.WordId)
            .ToListAsync();

        var settings = await _context.UserSettings.FirstOrDefaultAsync(s => s.UserId == userId);
        var newWordCount = settings?.DailyNewWordCount ?? 10;

        var newWords = await _context.Words
            .Where(w => !seenWordIds.Contains(w.WordId))
            .OrderBy(w => Guid.NewGuid())
            .Take(newWordCount)
            .ToListAsync();

        var allWords = await _context.Words.ToListAsync();
        var questions = new List<QuizQuestionResponse>();

        foreach (var progress in reviewProgress)
        {
            if (progress.Word != null)
                questions.Add(BuildQuestion(progress.Word, allWords));
        }

        foreach (var word in newWords)
        {
            questions.Add(BuildQuestion(word, allWords));
        }

        return questions.OrderBy(q => _random.Next()).ToList();
    }

    private QuizQuestionResponse BuildQuestion(Word word, List<Word> allWords)
    {
        var isMultipleChoice = _random.Next(2) == 0;

        if (!isMultipleChoice)
            return new QuizQuestionResponse(word.WordId, word.TurWordName, "TextInput", null);

        var distractors = allWords
            .Where(w => w.WordId != word.WordId)
            .OrderBy(w => Guid.NewGuid())
            .Take(3)
            .Select(w => w.EngWordName)
            .ToList();

        var choices = distractors.Append(word.EngWordName).OrderBy(c => Guid.NewGuid()).ToList();
        return new QuizQuestionResponse(word.WordId, word.TurWordName, "MultipleChoice", choices);
    }

    public async Task<SubmitAnswerResponse> SubmitAnswerAsync(string userId, SubmitAnswerRequest request)
    {
        var word = await _context.Words.FindAsync(request.WordId);
        if (word == null)
            throw new InvalidOperationException("Kelime bulunamadı.");

        var progress = await _context.UserWordProgresses
            .FirstOrDefaultAsync(p => p.UserId == userId && p.WordId == request.WordId);

        if (progress == null)
        {
            progress = new UserWordProgress
            {
                UserId = userId,
                WordId = request.WordId,
                ConsecutiveCorrectCount = 0,
                CurrentStageIndex = 0,
                NextReviewDate = DateTime.UtcNow.Date,
                IsMastered = false
            };
            _context.UserWordProgresses.Add(progress);
        }

        var isCorrect = string.Equals(request.Answer.Trim(), word.EngWordName.Trim(), StringComparison.OrdinalIgnoreCase);
        var today = DateTime.UtcNow.Date;

        progress.TotalAttempts += 1;
        if (isCorrect)
            progress.TotalCorrect += 1;

        if (isCorrect)
        {
            progress.ConsecutiveCorrectCount += 1;
            progress.CurrentStageIndex += 1;

            if (progress.CurrentStageIndex >= StageIntervalDays.Length)
            {
                progress.IsMastered = true;
            }
            else
            {
                progress.NextReviewDate = today.AddDays(StageIntervalDays[progress.CurrentStageIndex]);
            }
        }
        else
        {
            progress.ConsecutiveCorrectCount = 0;
            progress.CurrentStageIndex = 0;
            progress.NextReviewDate = today.AddDays(1);
        }

        await _context.SaveChangesAsync();

        return new SubmitAnswerResponse(isCorrect, word.EngWordName, progress.IsMastered, progress.IsMastered ? null : progress.NextReviewDate);
    }
}
