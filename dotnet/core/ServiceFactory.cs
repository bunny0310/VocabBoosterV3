using System;
using Microsoft.Extensions.Options;
using core.Models.Data;
using core.Services;

namespace core
{
    public class ServiceFactory
    {
        private readonly IOptions<VocabBoosterDatabaseSettings> _vocabBoosterDatabaseSettings;

        public ServiceFactory(
            IOptions<VocabBoosterDatabaseSettings> vocabBoosterDatabaseSettings)
        {
            _vocabBoosterDatabaseSettings = vocabBoosterDatabaseSettings;
        }
        public IWordsService WordsService()
        {
            return new WordsService(_vocabBoosterDatabaseSettings);
        }

        public IUserService UserService()
        {
            return new UserService(_vocabBoosterDatabaseSettings);
        }

        public ITokenService TokenService()
        {
            return new TokenService();
        }
    }
}
