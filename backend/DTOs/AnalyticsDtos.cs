namespace MemoryApp.Api.DTOs;

public record TopicSuccessRate(string Topic, int TotalAttempts, int TotalCorrect, double SuccessPercentage);
public record AnalyticsReportResponse(int TotalWordsStudied, int TotalMasteredWords, List<TopicSuccessRate> TopicBreakdown);
