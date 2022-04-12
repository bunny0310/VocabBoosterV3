using System;
using core.Models.Data;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using core.Models.Request;
using core.Models.Response;
using System.Linq;

namespace core.Services
{
    public class WordsService : IWordsService
    {
        private readonly IMongoCollection<Word> _wordsCollection;
        private int totalCount = -1;
        public WordsService()
        {
            var mongoClient = new MongoClient(
                ConfigurationVariables.MongoConnectionString);

            var mongoDatabase = mongoClient.GetDatabase(
                ConfigurationVariables.MongoDb);

            _wordsCollection = mongoDatabase.GetCollection<Word>("words");
        }

        public WordsService(IMongoCollection<Word> wordsCollection)
        {
            _wordsCollection = wordsCollection;
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

        public async Task<ExecutionOutcome<Word>> GetWord(string id) {
            try {
                if (id.Length != 24) {
                    throw new BadHttpRequestException("Invalid Id");
                }
                var word = await _wordsCollection.Find(word => word.Id != null && word.Id.Equals(id)).FirstOrDefaultAsync();
                return new ExecutionOutcome<Word>(){ 
                        IsSuccessful = word != null, 
                        Exception = word == null ? new BadHttpRequestException("Word not found", 404) : null,
                        Data = word
                    };
            } 
            catch (Exception e) {
                Console.WriteLine(e);
                return new ExecutionOutcome<Word>() {
                    IsSuccessful = false,
                    Exception = e
                 };
            }
        }
        public async Task<List<SearchWordResponse>> SearchWordsNameOnly(SearchWordsApiRequest requestBody)
        {
            var searchVal = requestBody.SearchValue;
            if (searchVal.TrimStart().TrimEnd().Equals(""))
            {
                return new List<SearchWordResponse>();
            }

            var filter = GenerateSearchFilter(requestBody);

            var results = await _wordsCollection
                .Find(filter)
                .Limit(6)
                .ToListAsync();
            var resultsStringOnly = results
            .Select(w => new SearchWordResponse() {
                Id = w.Id!,
                Name = w.Name
            }).ToList();
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

        public async Task<ExecutionOutcome<Word>> EditWord(Word request) {
            try {
                if (string.IsNullOrWhiteSpace(request.Id) || request.Id.Length != 24) {
                    throw new BadHttpRequestException("Invalid Id");
                }
                request.UpdatedAt = DateTime.UtcNow;
                var filter = Builders<Word>.Filter.Where(word => word.Id != null && word.Id.Equals(request.Id));
                var result = await _wordsCollection.ReplaceOneAsync(filter, request);
                return new ExecutionOutcome<Word>() {
                    IsSuccessful = true,
                    Data = request
                 };
            } catch (Exception e) {
                Console.WriteLine(e);
                return new ExecutionOutcome<Word>() {
                    IsSuccessful = false,
                    Exception = e
                 };
            }
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
