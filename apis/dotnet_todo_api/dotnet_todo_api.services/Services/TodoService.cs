
using dotnet_todo_api.core.Exceptions;
using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Repositories;
using dotnet_todo_api.core.Services;

namespace dotnet_todo_api.services.Services
{
    public class TodoService(ITodoRepository todoRepository) : ITodoService
    {
        private readonly ITodoRepository todoRepository = todoRepository;

        public async Task<IEnumerable<Todo>> GetTodosAsync(string username) => await todoRepository.GetTodosByUsernameAsync(username);

        public async Task CreateTodoAsync(Todo todo) => await todoRepository.CreateTodoAsync(todo);

        public async Task RemoveTodoAsync(string todoId, string username) { 
            // Check if the todo exists first and if it belongs to the user
            var todo = await todoRepository.GetTodoByIdAndUsernameAsync(todoId, username) ?? throw new TodoException("Todo not found or does not belong to the user");
            // If we get here, the todo exists and belongs to the user. Delete it
            await todoRepository.DeleteTodoAsync(todo);
        }

        public async Task ToggleTodoComplete(string todoId, string username)
        {
            // Check if the todo exists first and if it belongs to the user
            var todo = await todoRepository.GetTodoByIdAndUsernameAsync(todoId, username) ?? throw new TodoException("Todo not found or does not belong to the user");
            // If we get here, the todo exists and belongs to the user. Delete it
            todo.Completed = !todo.Completed;
            await todoRepository.UpdateTodoAsync(todo);
        }

        public async Task ClearCompletedTodo(string username)
        {
            // Check if the todo exists first and if it belongs to the user
            var todos = await todoRepository.GetCompletedByUsername(username);
            await todoRepository.RemoveManyTodoAsync(todos);
        }
    }
}
