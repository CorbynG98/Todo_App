
using dotnet_todo_api.core.Repositories;
using dotnet_todo_api.persistence;
using dotnet_todo_api.persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Asp.Versioning;
using dotnet_todo_api.services.Services;
using dotnet_todo_api.core.Services;
using Microsoft.Extensions.Configuration;
using AspNetCoreRateLimit;
using PersonalWebsiteBE.Core.Middleware;
using Google.Cloud.Diagnostics.AspNetCore3;

namespace dotnet_todo_api.api
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            // Add services to the container.
            var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
            builder.Services.AddDbContext<TodoDbContext>(options =>
                options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

            // DI injections
            // Repositories
            builder.Services.AddScoped<IUserRepository, UserRepository>();
            builder.Services.AddScoped<ISessionRepository, SessionRepository>();
            builder.Services.AddScoped<ITodoRepository, TodoRepository>();
            // Services
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<ITodoService, TodoService>();

            // Enable auto mapper
            builder.Services.AddAutoMapper(typeof(Program).Assembly);

            // Add API versioning
            builder.Services.AddApiVersioning(options =>
            {
                options.ReportApiVersions = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.ApiVersionReader = new UrlSegmentApiVersionReader();
            })
            .AddMvc()
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'V";
                options.SubstituteApiVersionInUrl = true;
            });


            builder.Services.AddOptions();
            builder.Services.AddMemoryCache();
            builder.Services.Configure<IpRateLimitOptions>(builder.Configuration.GetSection("IpRateLimiting"));
            builder.Services.Configure<IpRateLimitPolicies>(builder.Configuration.GetSection("IpRateLimitPolicies"));
            builder.Services.AddInMemoryRateLimiting();

            builder.Services.AddSingleton<IRateLimitConfiguration, RateLimitConfiguration>();
            builder.Services.AddSingleton<IProcessingStrategy, AsyncKeyLockProcessingStrategy>();

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            builder.Services.AddCors();

            builder.Services.AddGoogleErrorReportingForAspNetCore(new Google.Cloud.Diagnostics.Common.ErrorReportingServiceOptions
            {
                ProjectId = "rails-todo-app-386721",
                ServiceName = "dotnet.todo.api",
                Version = "1.0"
            });

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseIpRateLimiting();

            app.UseMiddleware<ExceptionHandlingMiddleware>();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            app.UseCors(t => t
                .AllowAnyHeader()
                .AllowAnyMethod()
                .AllowAnyOrigin());

            app.Run();
        }
    }
}
