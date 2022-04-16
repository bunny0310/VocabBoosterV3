using MongoDB.Bson;
using MongoDB.Driver;
using core.Models.Response;
using core.Models.Request;
using Microsoft.Extensions.Options;
using core.Models.Data;
using core;

namespace core.Services
{
    public class UserService : IUserService
    {
        private readonly IMongoCollection<User> _usersCollection;
        public UserService()
        {
            var mongoClient = new MongoClient(
                ConfigurationVariables.MongoConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ConfigurationVariables.MongoDb);

            _usersCollection = mongoDatabase.GetCollection<User>(
                "users");
        }

        public async Task<ExecutionOutcome<UserDTO>> AuthenticateUser(AuthenticationRequest request) {
            try {
                var filter = Builders<User>.Filter.Where(u => u.Email.Equals(request.Email) && u.Password.Equals(request.Password));
                var user = await _usersCollection.Find(filter).FirstOrDefaultAsync();
                if (user == null) {
                    throw new UnauthorizedAccessException("Invalid user credentials");
                }

                return new ExecutionOutcome<UserDTO>(){ Data = new UserDTO() {Email = user.Email}, IsSuccessful = true };
            }
            catch (Exception e) {
                return new ExecutionOutcome<UserDTO>(){ IsSuccessful = false, Exception = e };
            }

        }

        public async Task<ExecutionOutcome<UserDTO>> SignupUser(SignupRequest request)
        {
            try
            {
                var isUserPresent =  _usersCollection
                    .Find(u => u.Email.Equals(request.Email))
                    .FirstOrDefault() != null;
                
                if (isUserPresent)
                {
                    throw new BadHttpRequestException("User already exists!");
                }

                var user = new User()
                {
                    FirstName = request.FirstName,
                    LastName = request.LastName,
                    Email = request.Email,
                    Password = request.Password
                };

                await _usersCollection
                    .InsertOneAsync(user);

                return new ExecutionOutcome<UserDTO>(){ Data = new UserDTO() {Email = user.Email}, IsSuccessful = true };
            }
            catch (Exception ex)
            {
                return new ExecutionOutcome<UserDTO>(){ IsSuccessful = false, Exception = ex };
            }
        }
    }
}