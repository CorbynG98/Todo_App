using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace dotnet_todo_api.persistence.Repositories
{
    public class SessionRepository(TodoDbContext context) : ISessionRepository
    {
        private readonly TodoDbContext _context = context;

        public async Task CreateSessionAsync(Session session)
        {
            await _context.Sessions.AddAsync(session);
            await _context.SaveChangesAsync();
        }
        public async Task<Session?> GetSessionByTokenAsync(string sessionToken) => await _context.Sessions.FirstOrDefaultAsync(s => s.SessionToken == sessionToken);
        public async Task<string?> GetUserBySessionTokenAsync(string sessionToken)
        {
            return await _context.Sessions
                .Include(t => t.User)
                .Where(s => s.SessionToken == sessionToken)
                .Select(t => t.User!.Username )
                .FirstOrDefaultAsync();
        }
        public async Task DeleteSessionAsync(Session session) {
            _context.Sessions.Remove(session);
            await _context.SaveChangesAsync();
        }
    }
}
