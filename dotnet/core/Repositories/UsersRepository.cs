using MongoDB.Driver;
using MongoDB.Driver.Linq;
using core.Models.Data;
using System.Linq.Expressions;

namespace core.Repositories
{
    public class UsersRepository : IUsersRepository
    {
        private readonly IMongoCollection<User> _usersCollection;

		public UsersRepository()
		{
			var mongoClient = new MongoClient(
				ConfigurationVariables.MongoConnectionString);

			var mongoDatabase = mongoClient.GetDatabase(
				ConfigurationVariables.MongoDb);

			_usersCollection = mongoDatabase.GetCollection<User>("users");
		}

        public async Task<User> GetUser(Expression<Func<User, bool>> expression)
        {
            var user = await _usersCollection.Find(expression)
                .FirstOrDefaultAsync();

            return user;
        }

        public async Task<User> GetUserByEmail(string email)
        {
            var user = await _usersCollection.Find(w => w.Email == email)
                .FirstOrDefaultAsync();
            
            return user;
        }

        public async Task<User> AddUser(User user)
        {
            await _usersCollection.InsertOneAsync(user);
            return user;
        }
    }
}