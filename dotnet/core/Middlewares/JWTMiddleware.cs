using System;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using System.Security.Claims;
using core;
using core.Services;

namespace core.Middlewares
{
	public class JWTMiddleware
	{
        private readonly RequestDelegate _next;

        public JWTMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, ServiceFactory serviceFactory, IIdentityService identityService)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();

            if (token != null)
                await attachUserToContext(identityService, serviceFactory.UserService(), token);

            await _next(context);
        }

        private async Task attachUserToContext(IIdentityService identityService, IUserService userService, string token)
        {
            try
            {
                var tokenHandler = new JwtSecurityTokenHandler();
                var key = Encoding.ASCII.GetBytes(ConfigurationVariables.JwtKey);
                tokenHandler.ValidateToken(token, new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    // set clockskew to zero so tokens expire exactly at token expiration time (instead of 5 minutes later)
                    ClockSkew = TimeSpan.Zero
                }, out SecurityToken validatedToken);

                var jwtToken = (JwtSecurityToken)validatedToken;
                var email = (jwtToken.Claims.First(x => x.Type == ClaimTypes.Name).Value);

                // attach user to context on successful jwt validation
                var userServiceCall = await userService.GetUserByEmail(email);
                if (!userServiceCall.IsSuccessful)
                {
                    throw new Exception("user not found!");
                }
                identityService.User = userServiceCall.Data;
            }
            catch
            {
                // do nothing if jwt validation fails
                // user is not attached to context so request won't have access to secure routes
            }
        }
    }
}

