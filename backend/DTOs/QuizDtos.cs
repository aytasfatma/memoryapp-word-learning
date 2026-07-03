namespace MemoryApp.Api.DTOs;

public record QuizQuestionResponse(int WordId, string Prompt, string QuestionType, List<string>? Choices);
public record SubmitAnswerRequest(int WordId, string Answer);
public record SubmitAnswerResponse(bool IsCorrect, string CorrectAnswer, bool IsMastered, DateTime? NextReviewDate);
