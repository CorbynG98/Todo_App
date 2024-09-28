using dotnet_todo_api.core.Models;

namespace dotnet_todo_api.core.Repositories
{
    public interface IUserRepository
    {
        Task<User?> GetByUsernameAsync(string username);
        Task CreateUserAsync(User user);
    }
}
