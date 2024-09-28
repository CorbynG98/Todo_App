using Microsoft.AspNetCore.Mvc;

namespace dotnet_todo_api.core.StatusResults
{
    public class UnauthorizedResult : IActionResult
    {
        public async Task ExecuteResultAsync(ActionContext context)
        {
            var objectResult = new ObjectResult("No session token was found in the request.")
            {
                StatusCode = 401
            };

            await objectResult.ExecuteResultAsync(context);
        }
    }
}
