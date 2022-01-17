# stage 1
FROM mcr.microsoft.com/dotnet/aspnet:6.0 AS base
WORKDIR /app
ENV ASPNETCORE_ENVIRONMENT=Production
EXPOSE 5000

# stage 2
FROM mcr.microsoft.com/dotnet/sdk:6.0 AS build
WORKDIR ../app
COPY *.csproj ./
RUN dotnet restore

COPY . ./

RUN dotnet build "words.csproj" -c Release -o /app/build

# stage 3
FROM build as publish
RUN dotnet publish "words.csproj" -c Release -o /app/publish

# final stage
FROM base as final
WORKDIR /app
COPY --from=publish /app/publish .
CMD ASPNETCORE_URLS=http://*:$PORT dotnet words.dll