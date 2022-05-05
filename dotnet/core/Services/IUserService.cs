using core.Models.Request;
using core.Models.Response;

namespace core.Services
{
    public interface IUserService
    {
         Task<ExecutionOutcome<UserDTO>> AuthenticateUser(AuthenticationRequest request);
    }
}