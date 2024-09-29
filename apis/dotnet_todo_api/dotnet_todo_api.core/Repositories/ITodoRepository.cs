using dotnet_todo_api.core.Models;

namespace dotnet_todo_api.core.Repositories
{
    public interface ITodoRepository
    {
        Task<IEnumerable<Todo>> GetTodosByUsernameAsync(string username);
        Task<Todo?> GetTodoByIdAndUsernameAsync(string todoId, string username);
        Task<IEnumerable<Todo>> GetCompletedByUsername(string username);
        Task CreateTodoAsync(Todo todo);
        Task UpdateTodoAsync(Todo todo);
        Task DeleteTodoAsync(Todo todo);
        Task RemoveManyTodoAsync(IEnumerable<Todo> todos);
    }
}
