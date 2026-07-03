using MemoryApp.Api.DTOs;
using MemoryApp.Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using System.Web;

namespace MemoryApp.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ITokenService _tokenService;
    private readonly IEmailService _emailService;

    public AuthController(UserManager<IdentityUser> userManager, ITokenService tokenService, IEmailService emailService)
    {
        _userManager = userManager;
        _tokenService = tokenService;
        _emailService = emailService;
    }

    [HttpPost("register")]
    public async Task<IActionResult> Register(RegisterRequest request)
    {
        var existingUser = await _userManager.FindByEmailAsync(request.Email);
        if (existingUser != null)
            return BadRequest(new { message = "Bu email adresi zaten kayıtlı." });

        var user = new IdentityUser
        {
            UserName = request.UserName,
            Email = request.Email
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.UserName!, user.Email!));
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Unauthorized(new { message = "Email veya şifre hatalı." });

        var isPasswordValid = await _userManager.CheckPasswordAsync(user, request.Password);
        if (!isPasswordValid)
            return Unauthorized(new { message = "Email veya şifre hatalı." });

        var token = _tokenService.GenerateToken(user);
        return Ok(new AuthResponse(token, user.UserName!, user.Email!));
    }

    [HttpPost("forgot-password")]
    public async Task<IActionResult> ForgotPassword(ForgotPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return Ok(new { message = "Eğer bu email kayıtlıysa, sıfırlama linki gönderildi." });

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        var encodedToken = HttpUtility.UrlEncode(token);

        var resetLink = $"http://localhost:5173/reset-password?email={request.Email}&token={encodedToken}";
        var body = $"<p>Şifreni sıfırlamak için <a href='{resetLink}'>buraya tıkla</a>.</p>";

        await _emailService.SendEmailAsync(request.Email, "Şifre Sıfırlama - MemoryApp", body);

        return Ok(new { message = "Eğer bu email kayıtlıysa, sıfırlama linki gönderildi." });
    }

    [HttpPost("reset-password")]
    public async Task<IActionResult> ResetPassword(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
            return BadRequest(new { message = "Geçersiz işlem." });

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.NewPassword);
        if (!result.Succeeded)
            return BadRequest(new { errors = result.Errors.Select(e => e.Description) });

        return Ok(new { message = "Şifre başarıyla değiştirildi." });
    }
}
