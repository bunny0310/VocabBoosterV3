using System;
using Microsoft.Extensions.Options;
using core.Models.Data;
using core.Services;
using core.Repositories;

namespace core
{
    public class ServiceFactory
    {

        private IWordsService _wordsService;
        private ITokenService _tokenService;
        private IUserService _userService;

        public ServiceFactory(IIdentityService identityService)
        {
            var wordsRepository = new WordsRepository();
            _wordsService = new WordsService(wordsRepository, identityService);

            var usersRepository = new UsersRepository();
            _userService = new UserService(usersRepository);
            
            _tokenService = new TokenService();
        }

        public IWordsService WordsService()
        {
            return _wordsService;
        }

        public IUserService UserService()
        {
            return _userService;
        }

        public ITokenService TokenService()
        {
            return _tokenService;
        }
    }
}
