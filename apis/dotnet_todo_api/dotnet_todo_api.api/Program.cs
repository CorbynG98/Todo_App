
using dotnet_todo_api.core.Repositories;
using dotnet_todo_api.persistence;
using dotnet_todo_api.persistence.Repositories;
using Microsoft.EntityFrameworkCore;
using Asp.Versioning;
using dotnet_todo_api.services.Services;
using dotnet_todo_api.core.Services;

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
            // Services
            builder.Services.AddScoped<IAuthService, AuthService>();

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

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.UseHttpsRedirection();

            app.UseAuthentication();
            app.UseAuthorization();

            app.MapControllers();

            var url = Environment.GetEnvironmentVariable("ASPNETCORE_URLS") ?? "http://+:5003";
            app.Run(url);
        }
    }
}
