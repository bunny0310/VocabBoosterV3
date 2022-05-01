using core.Models.Request;
using core.Models.Response;
using core.Models.Data;

namespace core.Services
{
    public interface IUserService
    {
         Task<ExecutionOutcome<UserDTO>> AuthenticateUser(AuthenticationRequest request);
         Task<ExecutionOutcome<UserDTO>> SignupUser(SignupRequest request);
         Task<ExecutionOutcome<User>> GetUserByEmail(string email);
    }
}