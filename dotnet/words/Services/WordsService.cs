using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using database;
using database.Models;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using words.Models;
using System.Linq;

namespace words.Services
{
    public class WordsService : IWordsService
    {
        private readonly IMongoCollection<Word> _wordsCollection;
        private int totalCount = -1;
        public WordsService(
            IOptions<VocabBoosterDatabaseSettings> vocabBoosterDatabaseSettings)
        {
            var mongoClient = new MongoClient(
                vocabBoosterDatabaseSettings.Value.ConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                vocabBoosterDatabaseSettings.Value.DatabaseName);

            _wordsCollection = mongoDatabase.GetCollection<Word>(
                vocabBoosterDatabaseSettings.Value.WordsCollectionName);
        }

        public async Task<List<Word>> GetWords(int limit = 5, int offset = 0)
        {
            if (this.totalCount == -1)
            {
                this.totalCount = (int)await _wordsCollection.EstimatedDocumentCountAsync(null);
            }
            if (offset < 0)
            {
                offset = 0;
            }
            if (offset + limit > this.totalCount)
            {
                limit = this.totalCount - offset;
            }
            return await _wordsCollection
                .Find(_ => true)
                .Skip(offset)
                .Limit(limit)
                .ToListAsync();
        }

        public async Task<List<string>> SearchWordsNameOnly(SearchWordsApiRequest requestBody)
        {
            var nameRegex = requestBody.SearchByName ? requestBody.Name : @"[\s\S]*";
            var nameFilter = Builders<Word>.Filter.Regex("name", new BsonRegularExpression(nameRegex, "i"));
            var meaningRegex = requestBody.SearchByMeaning ? requestBody.Meaning : @"[\s\S]*";
            var meaningFilter = Builders<Word>.Filter.Regex("meaning", new BsonRegularExpression(meaningRegex, "i"));
            var sentencesRegex = requestBody.SearchBySentences ? string.Join(" ", requestBody.Sentences) : @"[\s\S]*";
            var sentencesFilter = Builders<Word>.Filter.Regex("sentences", new BsonRegularExpression(sentencesRegex, "i"));
            var synonymsRegex = requestBody.SearchBySynonyms ? string.Join(" ", requestBody.Synonyms) : @"[\s\S]*";
            var synonymsFilter = Builders<Word>.Filter.Regex("synonyms", new BsonRegularExpression(synonymsRegex, "i"));
            var tagsRegex = requestBody.SearchByTags ? string.Join(" ", requestBody.Tags) : @"[\s\S]*";
            var tagsFilter = Builders<Word>.Filter.Regex("tags", new BsonRegularExpression(tagsRegex, "i"));
            var results = await _wordsCollection
                .Find(nameFilter &= meaningFilter &= sentencesFilter &= synonymsFilter &= tagsFilter)
                .Limit(6)
                .ToListAsync();
            var resultsStringOnly = results.Select(w => w.Name).ToList();
            return resultsStringOnly;
        }
    }
}
