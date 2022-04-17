using System;
using Microsoft.Extensions.Options;
using core.Models.Data;
using core.Services;

namespace core
{
    public class ServiceFactory
    {
        public IWordsService WordsService()
        {
            return new WordsService();
        }

        public IUserService UserService()
        {
            return new UserService();
        }

        public ITokenService TokenService()
        {
            return new TokenService();
        }
    }
}
