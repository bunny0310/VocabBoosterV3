using core.Models.Data;
using core.Models.Response;
using core.Models.Request;

namespace core.Services
{
    public interface ITokenService
    {
        ExecutionOutcome<string> BuildToken(string key, string issuer, AuthenticationRequest user);
        ExecutionOutcome<bool> IsTokenValid(string key, string issuer, string token);
    }
}