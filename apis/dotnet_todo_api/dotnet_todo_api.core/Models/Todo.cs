using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_todo_api.core.Models
{
    [Table("Todo")]
    public class Todo
    {
        [Key]
        [Required]
        [Column("todo_id", TypeName = "varchar(64)")]
        public required string TodoId { get; set; }

        [Required]
        [Column("title", TypeName = "varchar(256)")]
        public required string Title { get; set; }

        [ForeignKey("User")]
        [Column("user_id", TypeName = "varchar(50)")]
        public required string UserId { get; set; }

        [Required]
        [Column("created_at")]
        public required DateTime CreatedAt { get; set; }

        [Required]
        [Column("completed")]
        public bool Completed { get; set; } = false;

        [NotMapped]
        public virtual required User User { get; set; }
    }
}