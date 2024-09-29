using dotnet_todo_api.core.Models;

namespace dotnet_todo_api.core.Repositories
{
    public interface ISessionRepository
    {
        Task CreateSessionAsync(Session session);
        Task<Session?> GetSessionByTokenAsync(string sessionToken);
        Task<string?> GetUserBySessionTokenAsync(string sessionToken);
        Task DeleteSessionAsync(Session session);
    }
}
