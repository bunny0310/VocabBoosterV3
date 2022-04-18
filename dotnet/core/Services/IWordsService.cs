using core.Models.Request;
using core.Models.Response;
using core.Models.Data;

namespace core.Services
{
    public interface IWordsService
    {
        public Task<List<Word>> GetWords(int limit = 5, int offset = 0, SearchWordsApiRequest requestBody = null);
        public Task<ExecutionOutcome<Word>> GetWord(string id);
        public Task<List<SearchWordResponse>> SearchWordsNameOnly(SearchWordsApiRequest requestBody);

        public Task<Word> AddWord(Word request);
        public Task<ExecutionOutcome<Word>> EditWord(Word request);

        public Task<ExecutionOutcome<List<Word>>> GetWordsRange(WordType type, DateTime startDate, DateTime endDate);
    }
}
