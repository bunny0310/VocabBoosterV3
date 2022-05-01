using System;
using core.Models.Data;
using Microsoft.Extensions.Options;
using MongoDB.Bson;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using core.Models.Request;
using core.Models.Response;
using System.Linq;

namespace core.Repositories
{
	public class WordsRepository : IWordsRepository
	{
		private readonly IMongoCollection<Word> _wordsCollection;
		private int totalCount = -1;

		public WordsRepository()
		{
			var mongoClient = new MongoClient(
				ConfigurationVariables.MongoConnectionString);

			var mongoDatabase = mongoClient.GetDatabase(
				ConfigurationVariables.MongoDb);

			_wordsCollection = mongoDatabase.GetCollection<Word>("words");
		}

		public async Task<List<Word>> GetWords(string userId, int? offset, int? limit, FilterDefinition<Word>? filter)
        {
			IFindFluent<Word, Word> query;
			if (filter != null)
            {
				query = _wordsCollection.Find(w => w.UserId == userId && filter.Inject());
			}
			else
            {
				query = _wordsCollection.Find(w => w.UserId == userId);
            }

			query = query
				.SortByDescending(word => word.CreatedAt);

			if (offset.HasValue)
            {
				query = query
					.Skip(Math.Min((int)query.CountDocuments(), offset.Value));
            }
			if (limit.HasValue)
            {
				query = query
					.Limit(Math.Min(limit.Value, (int)query.CountDocuments()));
            }
			
			var words = await query
					.ToListAsync();
			return words;
		}

		public async Task<Word?> GetWord(string userId, string id)
        {
			var word = await _wordsCollection
					.Find(word => word.Id != null && word.Id.Equals(id) && word.UserId == userId)
					.FirstOrDefaultAsync();

			return word;
        }

		public async Task<Word> AddWord(Word word)
        {
			await _wordsCollection.InsertOneAsync(word);

			return word;
        }

		public async Task<Word> EditWord(string userId, Word request)
        {
			var filter = Builders<Word>.Filter.Where(word => word.Id != null && word.Id.Equals(request.Id) && word.UserId == userId);
			var result = await _wordsCollection.ReplaceOneAsync(filter, request);

			return request;
		}

		public async Task DeleteWord(string userId, string id)
		{
			var word = await _wordsCollection.Find(w => w.UserId == userId && w.Id == id).FirstOrDefaultAsync();
			if (word == null)
			{
				throw new BadHttpRequestException($"Word with ID #{id} && user ID #{userId} not found.");
			}
			await _wordsCollection.FindOneAndDeleteAsync(w => w.Id == word.Id);
		}

		public async Task<int> GetTotalCount(string userId)
        {
			var count = (int)await _wordsCollection
			.Find(w => w.UserId == userId)
			.CountDocumentsAsync();

			return count;
		}
	}
}

