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

        public async Task<List<Word>> GetWords(int limit = 5, int offset = 0, SearchWordsApiRequest requestBody = null)
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

            if (requestBody.Filter == null || (requestBody.Filter.HasValue && !requestBody.Filter.Value))
            {
                return await _wordsCollection
                    .Find(word => true)
                    .SortByDescending(word => word.CreatedAt)
                    .Skip(offset)
                    .Limit(limit)
                    .ToListAsync();
            }

            return await _wordsCollection
                .Find(GenerateSearchFilter(requestBody))
                .Skip(offset)
                .Limit(limit)
                .ToListAsync();
        }

        public async Task<List<string>> SearchWordsNameOnly(SearchWordsApiRequest requestBody)
        {
            var searchVal = requestBody.SearchValue;
            if (searchVal.TrimStart().TrimEnd().Equals(""))
            {
                return new List<string>();
            }

            var filter = GenerateSearchFilter(requestBody);

            var results = await _wordsCollection
                .Find(filter)
                .Limit(6)
                .ToListAsync();
            var resultsStringOnly = results.Select(w => w.Name).ToList();
            return resultsStringOnly;
        }

        public async Task<Word> AddWord(Word request) {
            var word = new Word() {
                Name = request.Name,
                Meaning = request.Meaning,
                Sentences = request.Sentences,
                Synonyms = request.Synonyms,
                Tags = request.Tags,
                Types = request.Types,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
            };

            await _wordsCollection.InsertOneAsync(word);

            return word;
        }
        private FilterDefinition<Word> GenerateSearchFilter(SearchWordsApiRequest requestBody)
        {
            var searchVal = requestBody.SearchValue;
            var nameFilter = Builders<Word>.Filter.Regex("name", new BsonRegularExpression(searchVal, "i"));
            var meaningFilter = Builders<Word>.Filter.Regex("meaning", new BsonRegularExpression(searchVal, "i"));
            var sentencesFilter = Builders<Word>.Filter.Regex("sentences", new BsonRegularExpression(searchVal, "i"));
            var synonymsFilter = Builders<Word>.Filter.Regex("synonyms", new BsonRegularExpression(searchVal, "i"));
            var tagsFilter = Builders<Word>.Filter.Regex("tags", new BsonRegularExpression(searchVal, "i"));

            FilterDefinition<Word> filter = FilterDefinition<Word>.Empty;

            if (requestBody.SearchByName.HasValue && requestBody.SearchByName.Value)
            {
                filter = nameFilter;
            }

            if (requestBody.SearchByMeaning.HasValue && requestBody.SearchByMeaning.Value)
            {
                if (filter.Equals(FilterDefinition<Word>.Empty))
                    filter = meaningFilter;
                else
                    filter |= meaningFilter;
            }

            if (requestBody.SearchBySentences.HasValue && requestBody.SearchBySentences.Value)
            {
                if (filter.Equals(FilterDefinition<Word>.Empty))
                    filter = sentencesFilter;
                else
                    filter |= sentencesFilter;
            }

            if (requestBody.SearchBySynonyms.HasValue && requestBody.SearchBySynonyms.Value)
            {
                if (filter.Equals(FilterDefinition<Word>.Empty))
                    filter = synonymsFilter;
                else
                    filter |= synonymsFilter;
            }

            if (requestBody.SearchByTags.HasValue && requestBody.SearchByTags.Value)
            {
                if (filter.Equals(FilterDefinition<Word>.Empty))
                    filter = tagsFilter;
                else
                    filter |= tagsFilter;
            }
            return filter;
        }
    }
}
