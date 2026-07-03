using MemoryApp.Api.Data;
using MemoryApp.Api.DTOs;
using Microsoft.EntityFrameworkCore;

namespace MemoryApp.Api.Services;

public class PuzzleService : IPuzzleService
{
    private readonly MemoryAppDbContext _context;
    private readonly Random _random = new();

    public PuzzleService(MemoryAppDbContext context)
    {
        _context = context;
    }

    public async Task<MatchGameResponse> GetMatchGameAsync(int wordCount)
    {
        var words = await _context.Words.OrderBy(w => Guid.NewGuid()).Take(wordCount).ToListAsync();

        var cards = new List<MatchCard>();
        foreach (var word in words)
        {
            cards.Add(new MatchCard(Guid.NewGuid().ToString(), word.WordId, word.EngWordName, "en"));
            cards.Add(new MatchCard(Guid.NewGuid().ToString(), word.WordId, word.TurWordName, "tr"));
        }

        var shuffled = cards.OrderBy(c => Guid.NewGuid()).ToList();
        return new MatchGameResponse(shuffled);
    }

    public async Task<AnagramResponse> GetAnagramsAsync(int wordCount)
    {
        var words = await _context.Words.OrderBy(w => Guid.NewGuid()).Take(wordCount).ToListAsync();

        var questions = words.Select(w => new AnagramQuestion(
            w.WordId,
            Scramble(w.EngWordName),
            w.TurWordName
        )).ToList();

        return new AnagramResponse(questions);
    }

    private string Scramble(string word)
    {
        var letters = word.ToCharArray();
        var scrambled = new string(letters);

        var attempts = 0;
        while (scrambled.Equals(word, StringComparison.OrdinalIgnoreCase) && attempts < 10)
        {
            for (int i = letters.Length - 1; i > 0; i--)
            {
                int j = _random.Next(i + 1);
                (letters[i], letters[j]) = (letters[j], letters[i]);
            }
            scrambled = new string(letters);
            attempts++;
        }

        return scrambled;
    }

    public async Task<WordSearchResponse> GetWordSearchAsync(int wordCount)
    {
        var words = await _context.Words
            .OrderBy(w => Guid.NewGuid())
            .Take(wordCount)
            .Select(w => w.EngWordName.ToUpper())
            .ToListAsync();

        var size = Math.Max(10, words.Max(w => w.Length) + 2);
        var grid = new char[size][];
        for (int i = 0; i < size; i++)
        {
            grid[i] = new char[size];
            for (int j = 0; j < size; j++)
                grid[i][j] = '.';
        }

        var directions = new (int dx, int dy)[] { (1, 0), (0, 1), (1, 1) };

        foreach (var word in words)
        {
            var placed = false;
            var attempts = 0;

            while (!placed && attempts < 50)
            {
                var dir = directions[_random.Next(directions.Length)];
                var startX = _random.Next(size);
                var startY = _random.Next(size);
                var endX = startX + dir.dx * (word.Length - 1);
                var endY = startY + dir.dy * (word.Length - 1);

                if (endX < size && endY < size)
                {
                    placed = true;
                    for (int k = 0; k < word.Length; k++)
                    {
                        var x = startX + dir.dx * k;
                        var y = startY + dir.dy * k;
                        if (grid[x][y] != '.' && grid[x][y] != word[k])
                        {
                            placed = false;
                            break;
                        }
                    }

                    if (placed)
                    {
                        for (int k = 0; k < word.Length; k++)
                        {
                            var x = startX + dir.dx * k;
                            var y = startY + dir.dy * k;
                            grid[x][y] = word[k];
                        }
                    }
                }
                attempts++;
            }
        }

        for (int i = 0; i < size; i++)
            for (int j = 0; j < size; j++)
                if (grid[i][j] == '.')
                    grid[i][j] = (char)('A' + _random.Next(26));

        return new WordSearchResponse(grid, words, size);
    }
}
