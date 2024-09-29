using System.Text.Json.Serialization;

namespace dotnet_todo_api.api.Resources
{
    public class AuthResource
    {
        [JsonPropertyName("username")]
        public required string Username { get; set; }

        [JsonPropertyName("password")]
        public required string Password { get; set; }
    }
}
