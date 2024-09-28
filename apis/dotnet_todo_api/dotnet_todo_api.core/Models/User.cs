using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace dotnet_todo_api.core.Models
{
    [Table("User")]
    public class User
    {
        [Key]
        [Required]
        [Column("username", TypeName = "varchar(50)")]
        public required string Username { get; set; }

        [Required]
        [Column("password", TypeName = "varchar(256)")]
        public required string Password { get; set; }

        [NotMapped]
        public virtual ICollection<Session>? Sessions { get; set; }

        [NotMapped]
        public virtual ICollection<Todo>? Todos { get; set; }
    }
}

