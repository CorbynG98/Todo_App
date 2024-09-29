using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace dotnet_todo_api.persistence.Repositories
{
    public class TodoRepository(TodoDbContext context) : ITodoRepository
    {
        private readonly TodoDbContext _context = context;

        public async Task<IEnumerable<Todo>> GetTodosByUsernameAsync(string username) => await _context.Todos.Where(t => t.UserId == username).ToListAsync();
        public async Task<Todo?> GetTodoByIdAndUsernameAsync(string todoId, string username) => await _context.Todos.FirstOrDefaultAsync(t => t.TodoId == todoId && t.UserId == username);
        public async Task<IEnumerable<Todo>> GetCompletedByUsername(string username) => await _context.Todos.Where(t => t.UserId == username && t.Completed).ToListAsync();
        public async Task CreateTodoAsync(Todo todo) { 
            await _context.Todos.AddAsync(todo);
            await _context.SaveChangesAsync();
        }
        public async Task DeleteTodoAsync(Todo todo)
        {
            _context.Todos.Remove(todo);
            await _context.SaveChangesAsync();
        }
        public async Task UpdateTodoAsync(Todo todo)
        {
            _context.Todos.Update(todo);
            await _context.SaveChangesAsync();
        }
        public async Task RemoveManyTodoAsync(IEnumerable<Todo> todos)
        {
            _context.Todos.RemoveRange(todos);
            await _context.SaveChangesAsync();
        }
    }
}
