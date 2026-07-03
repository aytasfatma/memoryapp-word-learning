using Microsoft.AspNetCore.Identity;

namespace MemoryApp.Api.Services;

public interface ITokenService
{
    string GenerateToken(IdentityUser user);
}
