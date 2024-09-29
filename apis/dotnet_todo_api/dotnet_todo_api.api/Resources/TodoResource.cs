using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace dotnet_todo_api.api.Resources
{
    public class TodoResource
    {
        [JsonPropertyName("id")]
        public string? TodoId { get; set; }

        [JsonPropertyName("title")]
        public required string Title { get; set; }

        [JsonPropertyName("created_at")]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        [JsonPropertyName("completed")]
        public bool Completed { get; set; } = false;
    }
}
