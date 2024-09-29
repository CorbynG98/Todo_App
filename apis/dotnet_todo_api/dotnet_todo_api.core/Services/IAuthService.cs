using dotnet_todo_api.core.Models.Auth;

namespace dotnet_todo_api.core.Services
{
    public interface IAuthService
    {
        Task<AuthResult?> AuthenticateAsync(string username, string password);
        Task<AuthResult?> SignupAsync(string username, string password);
        Task<bool> IsSessionTokenValidAsync(string sessionToken);
        Task<string?> GetUserBySessionTokenAsync(string sessionToken);
        Task SignoutAsync(string sessionToken);
    }
}
