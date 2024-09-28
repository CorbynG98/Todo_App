using Microsoft.AspNetCore.Mvc;

namespace dotnet_todo_api.core.StatusResults
{
    public class ForbiddenResult : IActionResult
    {
        public async Task ExecuteResultAsync(ActionContext context)
        {
            var objectResult = new ObjectResult("Session token is not valid.")
            {
                StatusCode = 403
            };

            await objectResult.ExecuteResultAsync(context);
        }
    }
}
