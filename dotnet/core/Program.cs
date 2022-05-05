using core.Models.Data;
using core.Services;
using core;

var builder = WebApplication.CreateBuilder(args);
var root = Directory.GetParent(Directory.GetParent(Directory.GetCurrentDirectory())?.ToString())?.ToString();
var dotenv = Path.Combine(root ?? "", ".env");
DotEnv.Load(dotenv);

// Add services to the container. 
builder.Services.Configure<VocabBoosterDatabaseSettings>(
    builder.Configuration.GetSection("VocabBoosterDatabase"));

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

app.UseAuthorization();

app.MapControllers();

app.Run();
