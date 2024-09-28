using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Repositories;
using Microsoft.EntityFrameworkCore;

namespace dotnet_todo_api.persistence.Repositories
{
    public class SessionRepository(TodoDbContext context) : ISessionRepository
    {
        private readonly TodoDbContext _context = context;

        public async Task CreateSessionAsync(Session session) => await _context.Sessions.AddAsync(session);
        public async Task<Session?> GetSessionByTokenAsync(string sessionToken) => await _context.Sessions.FirstOrDefaultAsync(s => s.SessionToken == sessionToken);
        public void DeleteSession(Session session) => _context.Sessions.Remove(session);
    }
}
