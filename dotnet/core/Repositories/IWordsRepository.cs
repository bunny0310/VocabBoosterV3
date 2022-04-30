using System;
using core.Models.Data;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using core.Models.Request;
using core.Models.Response;
using System.Linq;

namespace core.Repositories
{
	public interface IWordsRepository
	{
		public Task<List<Word>> GetWords(string userId, int? offset, int? limit, FilterDefinition<Word>? filter);
		public Task<Word?> GetWord(string userId, string id);
		public Task<Word> AddWord(Word word);
		public Task<Word> EditWord(string userId, Word request);
		public Task<int> GetTotalCount(string userId);
	}
}

