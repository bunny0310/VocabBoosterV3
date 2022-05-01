using System;
using core.Models.Data;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using core.Models.Request;
using core.Models.Response;
using core.Repositories;
using System.Linq;

namespace core.Services
{
    public class WordsService : IWordsService
    {
        private readonly IWordsRepository _repository;
        private readonly IIdentityService _identityService;
        private int totalCount = -1;

        public WordsService(IWordsRepository repository, IIdentityService identityService)
        {
            _repository = repository;
            _identityService = identityService;
        }

        public async Task<ExecutionOutcome<List<Word>>> GetWords(int limit = 5, int offset = 0, SearchWordsApiRequest requestBody = null)
        {
            try
            {
                List<Word> words;
                var userId = _identityService.GetUserId();

                if (this.totalCount == -1)
                {
                    this.totalCount = await _repository.GetTotalCount(userId);
                }
                if (offset < 0)
                {
                    offset = 0;
                }
                if (offset + limit > this.totalCount)
                {
                    limit = this.totalCount - offset;
                }

                if (requestBody == null || (requestBody.Filter.HasValue && !requestBody.Filter.Value))
                {
                    words = await _repository.GetWords(userId, offset, limit, null);
                }
                else
                {
                    words = await _repository.GetWords(userId, offset, limit, GenerateSearchFilter(requestBody));
                }
                return new ExecutionOutcome<List<Word>>() { Data = words, IsSuccessful = true };
            }
            catch(Exception ex)
            {
                return new ExecutionOutcome<List<Word>>() { Exception = ex, IsSuccessful = false };
            }
        }

        public async Task<ExecutionOutcome<Word>> GetWord(string id) {
            try {
                if (id.Length != 24) {
                    throw new BadHttpRequestException("Invalid Id");
                }
                var userId = _identityService.GetUserId();
                var word = await _repository.GetWord(userId, id);
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
        public async Task<ExecutionOutcome<bool>> DeleteWord(string id) {

            try {
                if (string.IsNullOrWhiteSpace(id) || id.Length != 24) {
                
                    throw new BadHttpRequestException("Invalid Id");
                }

                var userId = _identityService.GetUserId();
                _repository.DeleteWord(userId, id);

                return new ExecutionOutcome<bool>() { Data = true, IsSuccessful = true };
            } catch (Exception ex) {
                return new ExecutionOutcome<bool>() { Exception = ex, IsSuccessful = false };
            }
        }
        public async Task<ExecutionOutcome<List<SearchWordResponse>>> SearchWordsNameOnly(SearchWordsApiRequest requestBody)
        {
            try
            {
                var searchVal = requestBody.SearchValue;

                if (searchVal.TrimStart().TrimEnd().Equals(""))
                {
                    return new ExecutionOutcome<List<SearchWordResponse>>(){ Data = new List<SearchWordResponse>(), IsSuccessful = true };
                }

                var filter = GenerateSearchFilter(requestBody);

                var results = await _repository.GetWords(_identityService.GetUserId(), null, 6, filter);

                var resultsStringOnly = results
                .Select(w => new SearchWordResponse()
                {
                    Id = w.Id!,
                    Name = w.Name
                }).ToList();
                return new ExecutionOutcome<List<SearchWordResponse>>() { Data = resultsStringOnly, IsSuccessful = true };
            }
            catch(Exception ex)
            {
                return new ExecutionOutcome<List<SearchWordResponse>>() { Exception = ex, IsSuccessful = false };
            }
        }

        public async Task<ExecutionOutcome<Word>> AddWord(Word request) {
            try
            {
                var word = new Word()
                {
                    UserId = _identityService.GetUserId(),
                    Name = request.Name,
                    Meaning = request.Meaning,
                    Sentences = request.Sentences,
                    Synonyms = request.Synonyms,
                    Tags = request.Tags,
                    Types = request.Types,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow,
                };

                word = await _repository.AddWord(word);

                return new ExecutionOutcome<Word>() { Data = word, IsSuccessful = true };
            }
            catch(Exception ex)
            {
                return new ExecutionOutcome<Word>() { Exception = ex, IsSuccessful = false };
            }
        }

        public async Task<ExecutionOutcome<Word>> EditWord(Word request) {
            try {
                if (string.IsNullOrWhiteSpace(request.Id) || request.Id.Length != 24) {
                    throw new BadHttpRequestException("Invalid Id");
                }

                var userId = _identityService.GetUserId();

                request.UpdatedAt = DateTime.UtcNow;

                var result = await _repository.EditWord(userId, request);

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

        public async Task<ExecutionOutcome<List<Word>>> GetWordsRange(WordType type, DateTime startDate, DateTime endDate)
        {
            try
            {
                var builder = Builders<Word>.Filter;
                var filter = builder.Where(word => word.Types.Contains(type) && word.UpdatedAt >= startDate && word.UpdatedAt <= endDate);
                var words = await _repository.GetWords(_identityService.GetUserId(), null, null, filter);
                return new ExecutionOutcome<List<Word>>() { IsSuccessful = true, Data = words };
            }
            catch (Exception ex)
            {
                return new ExecutionOutcome<List<Word>>() { IsSuccessful = false, Exception = ex };
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
