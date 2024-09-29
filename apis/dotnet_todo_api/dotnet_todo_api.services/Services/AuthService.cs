using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Models.Auth;
using dotnet_todo_api.core.Repositories;
using dotnet_todo_api.core.Services;
using dotnet_todo_api.core.Utility;
using System.Security.Cryptography;
using System.Text;

namespace dotnet_todo_api.services.Services
{
    public class AuthService(IUserRepository userRepository, ISessionRepository sessionRepository) : IAuthService
    {
        private readonly IUserRepository userRepository = userRepository;
        private readonly ISessionRepository sessionRepository = sessionRepository;

        public async Task<AuthResult?> AuthenticateAsync(string username, string password) {
            var user = await userRepository.GetByUsernameAsync(username);
            if (user == null || !BCrypt.Net.BCrypt.Verify(password, user.Password))
            {
                return null; // Invalid username or password
            }
            // Auth valid. Lets generate a session and return it
            var sessionToken = SecurityUtil.GenerateSha512Hash(Guid.NewGuid().ToString("N"));
            var session = new Session
            {
                UserId = user.Username,
                SessionToken = SecurityUtil.GenerateSha512Hash(sessionToken),
                CreatedAt = DateTime.UtcNow
            };
            await sessionRepository.CreateSessionAsync(session);
            return new AuthResult
            {
                Username = user.Username,
                SessionToken = sessionToken
            };
        }

        public async Task<AuthResult?> SignupAsync(string username, string password) {
            var user = await userRepository.GetByUsernameAsync(username);
            if (user != null) {
                return null;
            }

            var hashedPassword = BCrypt.Net.BCrypt.HashPassword(password, 12);
            var newUser = new User
            {
                Username = username,
                Password = hashedPassword
            };
            await userRepository.CreateUserAsync(newUser);
            // Create a session for this new user
            var sessionToken = SecurityUtil.GenerateSha512Hash(Guid.NewGuid().ToString("N"));
            var session = new Session
            {
                UserId = username,
                SessionToken = SecurityUtil.GenerateSha512Hash(sessionToken),
                CreatedAt = DateTime.UtcNow
            };
            await sessionRepository.CreateSessionAsync(session);
            return new AuthResult
            {
                Username = username,
                SessionToken = sessionToken
            };
        }

        public async Task SignoutAsync(string sessionToken)
        {
            var hashedSession = SecurityUtil.GenerateSha512Hash(sessionToken);
            var session = await sessionRepository.GetSessionByTokenAsync(hashedSession);
            if (session != null)
            {
                await sessionRepository.DeleteSessionAsync(session);
            }
        }

        public async Task<bool> IsSessionTokenValidAsync(string sessionToken)
        {
            var hashedSession = SecurityUtil.GenerateSha512Hash(sessionToken.ToString());
            var session = await sessionRepository.GetSessionByTokenAsync(hashedSession);
            if (session == null)
            {
                return false;
            }
            return true;
        }

        public async Task<string?> GetUserBySessionTokenAsync(string sessionToken)
        {
            var hashedSession = SecurityUtil.GenerateSha512Hash(sessionToken.ToString());
            return await sessionRepository.GetUserBySessionTokenAsync(hashedSession);
        }
    }
}
