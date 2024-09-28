using dotnet_todo_api.api.Resources;
using FluentValidation;

namespace dotnet_todo_api.api.Validators
{
    public class AuthValidator : AbstractValidator<AuthResource>
    {
        public AuthValidator()
        {
            RuleFor(t => t.Username)
                .NotEmpty()
                .MaximumLength(50)
                .WithMessage("Please enter a valid username");

            RuleFor(t => t.Password)
                .NotEmpty()
                .MaximumLength(256)
                .WithMessage("Please enter a valid password");
        }
    }
}
