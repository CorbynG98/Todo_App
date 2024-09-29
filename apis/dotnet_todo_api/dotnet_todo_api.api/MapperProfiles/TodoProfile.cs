using AutoMapper;
using dotnet_todo_api.api.Resources;
using dotnet_todo_api.core.Models;

namespace dotnet_todo_api.api.MapperProfiles
{
    public class TodoProfile : Profile
    {
        public TodoProfile()
        {
            CreateMap<Todo, TodoResource>().ReverseMap();
        }
    }
}
