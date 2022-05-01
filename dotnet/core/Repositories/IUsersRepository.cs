using core.Models.Data;
using System.Linq.Expressions;

namespace core.Repositories
{
    public interface IUsersRepository
    {
        public Task<User> GetUser(Expression<Func<User, bool>> expression);
        public Task<User> GetUserByEmail(string email);
        public Task<User> AddUser(User user);
    }
}