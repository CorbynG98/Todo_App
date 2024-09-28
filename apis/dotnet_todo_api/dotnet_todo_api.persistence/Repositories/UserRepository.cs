using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace dotnet_todo_api.persistence.Repositories
{
    public class UserRepository(TodoDbContext context) : IUserRepository
    {
        private readonly TodoDbContext _context = context;

        public async Task<User?> GetByUsernameAsync(string username) => await _context.Users.FirstOrDefaultAsync(t => t.Username == username);
        public async Task CreateUserAsync(User user) => await _context.Users.AddAsync(user);
    }
}
