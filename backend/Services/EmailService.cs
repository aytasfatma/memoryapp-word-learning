using System.Net;
using System.Net.Mail;

namespace MemoryApp.Api.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;

    public EmailService(IConfiguration config)
    {
        _config = config;
    }

    public async Task SendEmailAsync(string toEmail, string subject, string htmlBody)
    {
        var smtpHost = _config["Smtp:Host"]!;
        var smtpPort = int.Parse(_config["Smtp:Port"]!);
        var senderEmail = _config["Smtp:SenderEmail"]!;
        var senderName = _config["Smtp:SenderName"]!;
        var password = _config["Smtp:Password"]!;

        using var client = new SmtpClient(smtpHost, smtpPort)
        {
            Credentials = new NetworkCredential(senderEmail, password),
            EnableSsl = true
        };

        var mailMessage = new MailMessage
        {
            From = new MailAddress(senderEmail, senderName),
            Subject = subject,
            Body = htmlBody,
            IsBodyHtml = true
        };
        mailMessage.To.Add(toEmail);

        await client.SendMailAsync(mailMessage);
    }
}
