using AutoMapper;
using dotnet_todo_api.api.Resources;
using dotnet_todo_api.core.Models.Auth;

namespace dotnet_todo_api.api.MapperProfiles
{
    public class AuthProfile : Profile
    {
        public AuthProfile() {
            CreateMap<AuthResult, AuthResultResource>();
        }
    }
}
