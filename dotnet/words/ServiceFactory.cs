using System;
using Microsoft.Extensions.Options;
using words.Models;
using words.Services;

namespace words
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
    }
}
