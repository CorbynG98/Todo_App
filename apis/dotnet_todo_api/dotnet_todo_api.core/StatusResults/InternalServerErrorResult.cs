using Microsoft.AspNetCore.Mvc;

namespace dotnet_todo_api.core.StatusResults
{
    public class InternalServerErrorResult : IActionResult
    {
        public async Task ExecuteResultAsync(ActionContext context)
        {
            var objectResult = new ObjectResult("Internal Server Error.")
            {
                StatusCode = 500
            };

            await objectResult.ExecuteResultAsync(context);
        }
    }
}
