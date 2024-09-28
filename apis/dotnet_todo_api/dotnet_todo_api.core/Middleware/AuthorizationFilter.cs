using dotnet_todo_api.core.Services;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;

namespace PersonalWebsiteBE.Filters
{
    [AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
    public class AuthorizationFilter : Attribute, IAsyncAuthorizationFilter
    {
        public async Task OnAuthorizationAsync(AuthorizationFilterContext actionContext)
        {
            IAuthService authService = actionContext.HttpContext.RequestServices.GetRequiredService<IAuthService>();
            if (authService == null)
            {
                actionContext.Result = new dotnet_todo_api.core.StatusResults.InternalServerErrorResult();
                return;
            }
            // Try get the session token from header of request
            if (!actionContext.HttpContext.Request.Headers.TryGetValue("Authorization", out var sessionToken))
            {
                actionContext.Result = new dotnet_todo_api.core.StatusResults.UnauthorizedResult();
                return;
            }
            // Pass this token through to firestore query to check if it exists. Return true if it does exist
            if (!await authService.IsSessionTokenValidAsync(sessionToken)) {
                actionContext.Result = new dotnet_todo_api.core.StatusResults.ForbiddenResult();
                return;
            }
        }
    }
}
