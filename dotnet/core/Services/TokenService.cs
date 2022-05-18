using core.Models.Data;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using core.Models.Response;
using System.Text.Json;

namespace core.Services
{
    public class TokenService : ITokenService
    {
        private const double EXPIRY_DURATION_MINUTES = 30;
        public ExecutionOutcome<string> BuildToken(string key, string issuer, UserDTO user) {
            try {
                var claims = new[] {
                    new Claim("firstName", user.FirstName),
                    new Claim("email", user.Email)
                };

                var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));        
                var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256Signature);           
                var tokenDescriptor = new JwtSecurityToken(issuer, issuer, claims, 
                    expires: DateTime.Now.AddMinutes(EXPIRY_DURATION_MINUTES), signingCredentials: credentials);        
                var token =  new JwtSecurityTokenHandler().WriteToken(tokenDescriptor); 

                return new ExecutionOutcome<string>() { Data = token, IsSuccessful = true }; 
            } catch (Exception e) {
                return new ExecutionOutcome<string>() { IsSuccessful = false, Exception = e };
            }
        }

        public ExecutionOutcome<bool> IsTokenValid(string key, string issuer, string token)
        {
            var mySecret = Encoding.UTF8.GetBytes(key);           
            var mySecurityKey = new SymmetricSecurityKey(mySecret);
            var tokenHandler = new JwtSecurityTokenHandler(); 
            try 
            {
                tokenHandler.ValidateToken(token, 
                new TokenValidationParameters   
                {
                    ValidateIssuerSigningKey = true,
                    ValidateIssuer = true, 
                    ValidateAudience = true,    
                    ValidIssuer = issuer,
                    ValidAudience = issuer, 
                    IssuerSigningKey = mySecurityKey,
                }, out SecurityToken validatedToken);            
            }
            catch (Exception e)
            {
                return new ExecutionOutcome<bool>() {IsSuccessful = true, Data = false};
            }
            return new ExecutionOutcome<bool>() {IsSuccessful = true, Data = true};    
        }
    }
}
