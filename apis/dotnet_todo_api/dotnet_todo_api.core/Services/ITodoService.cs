using dotnet_todo_api.core.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace dotnet_todo_api.core.Services
{
    public interface ITodoService
    {
        Task<IEnumerable<Todo>> GetTodosAsync(string username);
        Task CreateTodoAsync(Todo todo);
        Task RemoveTodoAsync(string todoId, string username);
        Task ToggleTodoComplete(string todoId, string username);
        Task ClearCompletedTodo(string username);
    }
}
