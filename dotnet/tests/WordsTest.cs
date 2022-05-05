using Xunit;
using NSubstitute;
using MongoDB.Driver;
using core.Models.Data;
using core.Models.Request;
using core.Services;
using System.Collections.Generic;
using System.Linq;
using core.Utils;
using core.Repositories;
using System;
using MongoDB.Bson;
using MongoDB.Driver.Linq;
using Microsoft.AspNetCore.Http;
using System.Threading.Tasks;

namespace tests;

public class WordsTest
{
    private readonly IWordsRepository _mockWordsRepository;
    private readonly IIdentityService _mockIdentityService;
    private readonly WordsService _testWordsService;
    private readonly Dictionary<string, Word> _store;

    public WordsTest()
    {

        _mockWordsRepository = Substitute.For<IWordsRepository>();
        _mockIdentityService = Substitute.For<IIdentityService>();

        var fakeUserId = ObjectId.GenerateNewId().ToString();
        _mockIdentityService.GetUserId()
            .ReturnsForAnyArgs(args => fakeUserId);

        _testWordsService = new WordsService(_mockWordsRepository, _mockIdentityService);
        _store = new Dictionary<string, Word>();

        _mockWordsRepository.GetWords(default, default, default, default)
            .ReturnsForAnyArgs(args =>
            {
                var userId = (string)args[0];
                var offset = (int?)args[1];
                var limit = (int?)args[2];
                var filter = (FilterDefinition<Word>?)args[3];

                var words = _store.Values.AsQueryable();
                words = words.Where(w => w.UserId == userId);

                if (offset.HasValue)
                {
                    words = words.Skip(Math.Min((int)words.Count(), offset.Value));
                }

                if (limit.HasValue)
                {
                    words = words.Take(Math.Min((int)words.Count(), limit.Value));
                }

                if (filter != null)
                {
                    // BUG: MongoDB Driver doesn't like using this extension method on non-MongoDB related queries. Cannot unit test this.
                    words = words.ToList().AsQueryable().Where(w => filter.Inject());
                }

                return words.ToList();
            });

        _mockWordsRepository.GetTotalCount(default)
            .ReturnsForAnyArgs(args => _store.Where(w => w.Value.UserId == (string)args[0]).Count());

        _mockWordsRepository.GetWord(default, default)
            .ReturnsForAnyArgs(args =>
            {
                var userId = (string)args[0];
                var id = (string)args[1];

                if (id.Length != 24)
                {
                    throw new Exception("Invalid Id");
                }
                
                var word = _store.Where(w => w.Value.UserId == userId && w.Value.Id == id)
                    .FirstOrDefault();
                
                return word.Value;
            });

        _mockWordsRepository.AddWord(default)
            .ReturnsForAnyArgs(args =>
            {
                var request = (Word)args[0];
                var word = new Word()
                {
                    Id = _mockIdentityService.GetUserId(),
                    Name = request.Name,
                    Meaning = request.Meaning,
                    Sentences = request.Sentences,
                    Synonyms = request.Synonyms,
                    Tags = request.Tags,
                    Types = request.Types,
                    CreatedAt = DateTime.UtcNow,
                    UpdatedAt = DateTime.UtcNow
                };
                _store.Add(word.Id, word);
                return word;
            });

        _mockWordsRepository.EditWord(default, default)
            .ReturnsForAnyArgs(args =>
            {
                var userId = (string)args[0];
                var request = (Word)args[1];

                var word = _store.Where(w => w.Value.UserId == userId && w.Value.Id == request.Id)
                    .FirstOrDefault().Value;

                if (word == null)
                {
                    throw new BadHttpRequestException($"Word with the ID #{request.Id} and user ID #{userId} not found!");
                }

                word.Name = request.Name;
                word.Meaning = request.Meaning;
                word.Sentences = request.Sentences;
                word.Tags = request.Tags;
                word.Types = request.Types;
                word.Synonyms = request.Synonyms;
                word.UpdatedAt = DateTime.UtcNow;
                _store[word.Id] = word;
                return word;
            });

            _mockWordsRepository.DeleteWord(default, default)
                .ReturnsForAnyArgs(args => {
                    var userId = (string)args[0];
                    var id = (string)args[1];
                    var wordId = _store.Where(w => w.Value.Id == id && w.Value.UserId == userId)
                        .FirstOrDefault()
                        .Key;

                    _store.Remove(wordId);

                    return Task.FromResult(true);
                });
                

        for (int i=0; i<20; ++i)
        {
            var word = RandomDataGenerator.RandomWord();
            word.UserId = _mockIdentityService.GetUserId();
            _store.Add(word.Id, word);
        }
    }

    [Theory]
    [InlineData(5, 0)]
    [InlineData(3, 1)]
    public async void TestGetWords(int limit = 5, int offset = 0, SearchWordsApiRequest requestBody = null)
    {
        var serviceCall = await _testWordsService.GetWords(limit, offset, requestBody);
        var count = serviceCall.Data?.Count;

        Assert.True(serviceCall.IsSuccessful);
        Assert.Equal(limit, count);
    }

    [Fact]
    public async void TestGetWord()
    {
        var correctId = _store.First().Key;
        var incorrectId = "somewrongid";

        var expectedWord = _store[correctId];

        var correctServiceCall = await _testWordsService.GetWord(correctId);
        var correctWord = correctServiceCall.Data;

        Assert.True(correctServiceCall.IsSuccessful);
        Assert.Equal(expectedWord, correctWord);

        var incorrectServiceCall = await _testWordsService.GetWord(incorrectId);

        Assert.False(incorrectServiceCall.IsSuccessful);

    }

    [Fact]
    public async void TestAddWord()
    {
        var randomWord = RandomDataGenerator.RandomWord();

        var serviceCall = await _testWordsService.AddWord(randomWord);
        var randomWordWithId = serviceCall.Data;

        Assert.True(serviceCall.IsSuccessful);
        Assert.NotNull(randomWordWithId);
        Assert.NotNull(randomWordWithId?.Id);
        var id = randomWordWithId?.Id;
        Assert.Equal(randomWordWithId?.Name, _store[id].Name);
    }

    [Fact]
    public async void TestEditWord()
    {
        var someWord = _store.First().Value;
        var newName = "Updated Word";
        someWord.Name = newName;

        var correctServiceCall = await _testWordsService.EditWord(someWord);
        someWord.Id = "corrupted ID";
        var incorrectServiceCall = await _testWordsService.EditWord(someWord);

        Assert.True(correctServiceCall.IsSuccessful);
        Assert.Equal(newName, correctServiceCall.Data?.Name);
        Assert.Equal(DateTime.UtcNow.Date, correctServiceCall.Data?.UpdatedAt?.Date);
        Assert.False(incorrectServiceCall.IsSuccessful);

    }

    [Fact]
    public async void TestDeleteWord()
    {
        var someWord = _store.First().Value;

        var correctServiceCall = await _testWordsService.DeleteWord(someWord.Id);
        var incorrectServiceCall = await _testWordsService.DeleteWord("corrupted Id");

        Assert.True(correctServiceCall.IsSuccessful);
        Assert.False(incorrectServiceCall.IsSuccessful);
        Assert.False(_store.ContainsKey(someWord.Id));
    }
}
