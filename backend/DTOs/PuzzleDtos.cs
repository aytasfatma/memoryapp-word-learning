namespace MemoryApp.Api.DTOs;

public record MatchCard(string CardId, int WordId, string Text, string Language);
public record MatchGameResponse(List<MatchCard> Cards);

public record AnagramQuestion(int WordId, string ScrambledWord, string TurkishHint);
public record AnagramResponse(List<AnagramQuestion> Questions);

public record WordSearchResponse(char[][] Grid, List<string> WordsToFind, int Size);
