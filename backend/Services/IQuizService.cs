using MemoryApp.Api.DTOs;

namespace MemoryApp.Api.Services;

public interface IQuizService
{
    Task<List<QuizQuestionResponse>> GetTodayQuestionsAsync(string userId);
    Task<SubmitAnswerResponse> SubmitAnswerAsync(string userId, SubmitAnswerRequest request);
}
