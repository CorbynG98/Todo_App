using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_todo_api.core.Models
{
    [Table("Session")]
    public class Session
    {
        [Key]
        [Required]
        [Column("session_token", TypeName = "varchar(128)")]
        public required string SessionToken { get; set; }

        [ForeignKey("User")]
        [Column("user_id", TypeName = "varchar(50)")]
        public required string UserId { get; set; }

        [Required]
        [Column("created_at")]
        public required DateTime CreatedAt { get; set; }

        [NotMapped]
        public virtual User? User { get; set; }
    }
}