using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace dotnet_todo_api.core.Models.Auth
{
    public class AuthResult
    {
        public required string Username { get; set; }

        public required string SessionToken { get; set; }
    }
}
