using Asp.Versioning;
using AutoMapper;
using dotnet_todo_api.api.Resources;
using dotnet_todo_api.api.Validators;
using dotnet_todo_api.core.Exceptions;
using dotnet_todo_api.core.Models;
using dotnet_todo_api.core.Models.Auth;
using dotnet_todo_api.core.Services;
using Microsoft.AspNetCore.Mvc;
using PersonalWebsiteBE.Filters;

namespace dotnet_todo_api.api.Controllers.v1
{
    [ApiController]
    [ApiVersion("1")]
    [Route("v{apiVersion:apiVersion}/[controller]")]
    public class TodoController(IMapper mapper, IAuthService authService, ITodoService todoService) : ControllerBase
    {
        private readonly IAuthService authService = authService;
        private readonly ITodoService todoService = todoService;
        private readonly IMapper mapper = mapper;

        [HttpGet]
        [AuthorizationFilter]
        public async Task<IActionResult> GetTodos()
        {
            var user = await authService.GetUserBySessionTokenAsync(Request.Headers.Authorization!);

            var todos = await todoService.GetTodosAsync(user!);

            var todoResource = mapper.Map<IEnumerable<TodoResource>>(todos);
            return Ok(todoResource);
        }

        [HttpPost]
        [AuthorizationFilter]
        public async Task<IActionResult> CreateTodo(TodoResource newTodo)
        {
            var username = await authService.GetUserBySessionTokenAsync(Request.Headers.Authorization!);

            var todo = mapper.Map<Todo>(newTodo);
            todo.TodoId = Guid.NewGuid().ToString();
            todo.UserId = username!;
            await todoService.CreateTodoAsync(todo);

            var todoResource = mapper.Map<TodoResource>(todo);
            return Ok(todoResource);
        }

        [HttpDelete("{todoId}")]
        [AuthorizationFilter]
        public async Task<IActionResult> CreateTodo([FromRoute]string todoId)
        {
            var username = await authService.GetUserBySessionTokenAsync(Request.Headers.Authorization!);
            try
            {
                await todoService.RemoveTodoAsync(todoId, username!);
            } catch (TodoException ex)
            {
                return BadRequest(ex.Message);
            }
            return NoContent();
        }

        [HttpPost("{todoId}/togglecomplete")]
        [AuthorizationFilter]
        public async Task<IActionResult> ToggleComplete([FromRoute] string todoId)
        {
            var username = await authService.GetUserBySessionTokenAsync(Request.Headers.Authorization!);
            try
            {
                await todoService.ToggleTodoComplete(todoId, username!);
            }
            catch (TodoException ex)
            {
                return BadRequest(ex.Message);
            }
            return NoContent();
        }

        [HttpPost("clearcompleted")]
        [AuthorizationFilter]
        public async Task<IActionResult> ClearCompleted()
        {
            var username = await authService.GetUserBySessionTokenAsync(Request.Headers.Authorization!);
            try
            {
                await todoService.ClearCompletedTodo(username!);
            }
            catch (TodoException ex)
            {
                return BadRequest(ex.Message);
            }
            return NoContent();
        }
    }
}
