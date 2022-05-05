using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using core;
using core.Services;
using core.Middlewares;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);
var root = Directory.GetParent(Directory.GetParent(Directory.GetCurrentDirectory())?.ToString())?.ToString();
var dotenv = Path.Combine(root ?? "", ".env");
DotEnv.Load(dotenv);

// Add services to the container.

builder.Services.AddScoped<ServiceFactory>();
builder.Services.AddScoped<IIdentityService, IdentityService>();

builder.Services.AddAuthentication(o =>
{
    o.DefaultAuthenticateScheme = JwtBearerDefaults.
AuthenticationScheme;
    o.DefaultChallengeScheme = JwtBearerDefaults.
AuthenticationScheme;
    o.DefaultScheme = JwtBearerDefaults.
AuthenticationScheme;
})   
.AddJwtBearer(options =>    
{    
    options.TokenValidationParameters = new TokenValidationParameters    
    {    
        ValidateIssuer = true,    
        ValidateAudience = true,    
        ValidateLifetime = true,    
        ValidateIssuerSigningKey = true,    
        ValidIssuer = ConfigurationVariables.JwtIssuer,    
        ValidAudience = ConfigurationVariables.JwtIssuer,    
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(ConfigurationVariables.JwtKey))    
    };    
});

builder.Services.AddAuthorization();

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
builder.Services.AddSwaggerGen(c =>
  {
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "You api title", Version = "v1" });
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
      {
        Description = @"JWT Authorization header using the Bearer scheme. \r\n\r\n 
                      Enter 'Bearer' [space] and then your token in the text input below.
                      \r\n\r\nExample: 'Bearer 12345abcdef'",
         Name = "Authorization",
         In = ParameterLocation.Header,
         Type = SecuritySchemeType.ApiKey,
         Scheme = "Bearer"
       });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement()
      {
        {
          new OpenApiSecurityScheme
          {
            Reference = new OpenApiReference
              {
                Type = ReferenceType.SecurityScheme,
                Id = "Bearer"
              },
              Scheme = "oauth2",
              Name = "Bearer",
              In = ParameterLocation.Header,

            },
            new List<string>()
          }
        });
});


var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// app.UseHttpsRedirection();

app.UseCors("corsOrigins");

app.UseMiddleware<JWTMiddleware>();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
