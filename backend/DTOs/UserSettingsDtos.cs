namespace MemoryApp.Api.DTOs;

public record UserSettingsResponse(int DailyNewWordCount);
public record UpdateUserSettingsRequest(int DailyNewWordCount);
