#See https://aka.ms/customizecontainer to learn how to customize your debug container and how Visual Studio uses this Dockerfile to build your images for faster debugging.

FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS base
USER app
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:5003
ENV PORT=5003
EXPOSE 5003

FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
ARG BUILD_CONFIGURATION=Release
WORKDIR /src
COPY ["dotnet_todo_api.api/dotnet_todo_api.api.csproj", "dotnet_todo_api.api/"]
COPY ["dotnet_todo_api.core/dotnet_todo_api.core.csproj", "dotnet_todo_api.core/"]
COPY ["dotnet_todo_api.services/dotnet_todo_api.services.csproj", "dotnet_todo_api.services/"]
COPY ["dotnet_todo_api.persistence/dotnet_todo_api.persistence.csproj", "dotnet_todo_api.persistence/"]
RUN dotnet restore "./dotnet_todo_api.api/dotnet_todo_api.api.csproj"
COPY . .
WORKDIR "/src/dotnet_todo_api.api"
RUN dotnet build "./dotnet_todo_api.api.csproj" -c $BUILD_CONFIGURATION -o /app/build

FROM build AS publish
ARG BUILD_CONFIGURATION=Release
RUN dotnet publish "./dotnet_todo_api.api.csproj" -c $BUILD_CONFIGURATION -o /app/publish /p:UseAppHost=false

FROM base AS final
WORKDIR /app
COPY --from=publish /app/publish .
ENTRYPOINT ["dotnet", "dotnet_todo_api.api.dll"]