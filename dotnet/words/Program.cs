using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using words;
using words.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<VocabBoosterDatabaseSettings>(
    builder.Configuration.GetSection("VocabBoosterDatabase"));
builder.Services.AddScoped<ServiceFactory>();

builder.Services.AddCors(options =>
{
    options.AddPolicy("corsOrigins",
                          builder =>
                          {
                              builder
                                .AllowAnyOrigin()
                                .AllowAnyHeader()
                                .AllowAnyMethod();
                          });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
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

app.UseCors("corsOrigins");

app.UseAuthorization();

app.MapControllers();

app.Run();
