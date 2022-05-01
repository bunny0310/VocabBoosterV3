using MongoDB.Bson;
using MongoDB.Driver;
using core.Models.Response;
using core.Models.Request;
using Microsoft.Extensions.Options;
using core.Models.Data;
using core.Repositories;
using System.Linq.Expressions;

namespace core.Services
{
    public class UserService : IUserService
    {
        private readonly IUsersRepository _repository;
        public UserService(IUsersRepository repository)
        {
            _repository = repository;
        }

        public async Task<ExecutionOutcome<UserDTO>> AuthenticateUser(AuthenticationRequest request) {
            try {
                Expression<Func<User, bool>> expression = u => u.Email.Equals(request.Email) && u.Password.Equals(request.Password);
                var user = await _repository.GetUser(expression);

                if (user == null) {
                    throw new UnauthorizedAccessException("Invalid user credentials");
                }

                return new ExecutionOutcome<UserDTO>(){ Data = new UserDTO() { Email = user.Email, FirstName = user.FirstName }, IsSuccessful = true };
            }
            catch (Exception e) {
                return new ExecutionOutcome<UserDTO>(){ IsSuccessful = false, Exception = e };
            }

        }

        public async Task<ExecutionOutcome<UserDTO>> SignupUser(SignupRequest request)
        {
            try
            {
                var existentUser = await _repository.GetUserByEmail(request.Email);

                if (existentUser != null)
                {
                    throw new BadHttpRequestException("User already exists!");
                }

                var user = new User()
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Password = request.Password,
                    CreatedAt = DateTime.UtcNow
                };

                await _repository
                    .AddUser(user);

                return new ExecutionOutcome<UserDTO>(){ Data = new UserDTO() { Email = user.Email }, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                return new ExecutionOutcome<UserDTO>(){ IsSuccessful = false, Exception = ex };
            }
        }

        public async Task<ExecutionOutcome<User>> GetUserByEmail(string email)
        {
            try
            {
                var user = await _repository.GetUserByEmail(email);

                if (user == null)
                {
                    throw new BadHttpRequestException("User Not Found!");
                }
                return new ExecutionOutcome<User>() { Data = user, IsSuccessful = true };
            }
            catch(Exception ex)
            {
                return new ExecutionOutcome<User>() { Exception = ex, IsSuccessful = false };
            }
        }
    }
}