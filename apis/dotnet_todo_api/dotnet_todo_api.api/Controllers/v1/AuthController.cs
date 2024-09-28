using Asp.Versioning;
using AutoMapper;
using dotnet_todo_api.api.Resources;
using dotnet_todo_api.api.Validators;
using dotnet_todo_api.core.Services;
using Microsoft.AspNetCore.Mvc;
using PersonalWebsiteBE.Filters;

namespace dotnet_todo_api.api.Controllers.v1
{
    [ApiController]
    [ApiVersion("1")]
    [Route("v{apiVersion:apiVersion}/[controller]")]
    public class AuthController(IMapper mapper, IAuthService authService) : ControllerBase
    {
        private readonly IAuthService authService = authService;
        private readonly AuthValidator authValidator = new();
        private readonly IMapper mapper = mapper;

        [HttpPost("Signin")]
        public async Task<IActionResult> Signin([FromBody]AuthResource authResource)
        {
            var validationResult = authValidator.Validate(authResource);
            var requestIsInvalid = !validationResult.IsValid;
            if (requestIsInvalid)
            {
                return BadRequest(validationResult.Errors);
            }
            var authResult = await authService.AuthenticateAsync(authResource.Username, authResource.Password);
            if (authResult == null) {
                return BadRequest("Username or password invalid");
            }
            var authResultResource = mapper.Map<AuthResultResource>(authResult);
            return Ok(authResultResource);
        }

        [HttpPost("Signup")]
        public async Task<IActionResult> Signup([FromBody] AuthResource authResource)
        {
            var validationResult = authValidator.Validate(authResource);
            var requestIsInvalid = !validationResult.IsValid;
            if (requestIsInvalid)
            {
                return BadRequest(validationResult.Errors);
            }
            var authResult = await authService.SignupAsync(authResource.Username, authResource.Password);
            if (authResult == null)
            {
                return BadRequest("Username may be taken");
            }
            var authResultResource = mapper.Map<AuthResultResource>(authResult);
            return Ok(authResultResource);
        }

        [HttpPost("Signout")]
        [AuthorizationFilter]
        public async Task<IActionResult> Signup()
        {
            // Get Authorization header from the request
            if (!Request.Headers.TryGetValue("Authorization", out var sessionToken)) {
                return BadRequest("No 'Authorization' header on the request");
            }
            await authService.SignoutAsync(sessionToken.ToString());
            return NoContent();
        }
    }
}
