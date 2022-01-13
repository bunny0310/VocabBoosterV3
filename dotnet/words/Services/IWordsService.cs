using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using database.Models;
using words.Models;

namespace words.Services
{
    public interface IWordsService
    {
        public Task<List<Word>> GetWords(int limit = 5, int offset = 0, SearchWordsApiRequest requestBody = null);
        public Task<List<string>> SearchWordsNameOnly(SearchWordsApiRequest requestBody);

        Task<Word> AddWord(Word request);
    }
}
