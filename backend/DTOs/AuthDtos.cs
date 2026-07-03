namespace MemoryApp.Api.DTOs;

public record RegisterRequest(string UserName, string Email, string Password);
public record LoginRequest(string Email, string Password);
public record ForgotPasswordRequest(string Email);
public record ResetPasswordRequest(string Email, string Token, string NewPassword);
public record AuthResponse(string Token, string UserName, string Email);
