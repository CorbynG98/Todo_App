using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Models.Auth;
using dotnet_todo_api.core.Repositories;
using dotnet_todo_api.core.Services;
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
            var sessionToken = GenerateSha512Hash(Guid.NewGuid().ToString("N"));
            var session = new Session
            {
                UserId = user.Username,
                SessionToken = sessionToken,
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
            var sessionToken = GenerateSha512Hash(Guid.NewGuid().ToString("N"));
            var session = new Session
            {
                UserId = username,
                SessionToken = sessionToken,
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
            var session = await sessionRepository.GetSessionByTokenAsync(sessionToken);
            if (session != null)
            {
                sessionRepository.DeleteSession(session);
            }
        }

        public async Task<bool> IsSessionTokenValidAsync(string sessionToken)
        {
            var session = await sessionRepository.GetSessionByTokenAsync(sessionToken);
            if (session == null)
            {
                return false;
            }
            return true;
        }

        private static string GenerateSha512Hash(string input)
        {
            // Convert input string to byte array
            byte[] inputBytes = Encoding.UTF8.GetBytes(input);

            // Create SHA512 hash
            byte[] hashBytes = SHA512.HashData(inputBytes);

            // Convert hash to hexadecimal string
            StringBuilder sb = new();
            for (int i = 0; i < hashBytes.Length; i++)
            {
                sb.Append(hashBytes[i].ToString("x2"));
            }

            return sb.ToString();
        }
    }
}
