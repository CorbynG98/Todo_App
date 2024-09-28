using System.Text.Json.Serialization;

namespace dotnet_todo_api.api.Resources
{
    public class AuthResultResource
    {
        [JsonPropertyName("username")]
        public required string Username { get; set; }


        [JsonPropertyName("session_token")]
        public required string SessionToken { get; set; }
    }
}
