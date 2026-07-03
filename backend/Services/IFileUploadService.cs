namespace MemoryApp.Api.Services;

public interface IFileUploadService
{
    Task<string?> SaveFileAsync(IFormFile? file, string subFolder);
}
