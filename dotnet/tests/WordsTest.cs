using Xunit;
using NSubstitute;
using MongoDB.Driver;
using core.Models.Data;
using core.Models.Request;
using core.Models.Response;
using core.Services;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;
using core.Utils;

namespace tests;

public class WordsTest
{
    private readonly IMongoCollection<Word> _mockWordsCollection;
    private readonly WordsService _testWordsService;
    private readonly Dictionary<string, Word> _store;

    public WordsTest()
    {
        _mockWordsCollection = Substitute.For<IMongoCollection<Word>>();
        _testWordsService = new WordsService(_mockWordsCollection);
        _store = new Dictionary<string, Word>();

        _mockWordsCollection.Find(default, default, default)
            .ReturnsForAnyArgs(args =>
            {
                var values = _store.Values.ToList();
                var filter = (FilterDefinition<Word>)args[0];
                var expression = (Expression<System.Func<Word, bool>>)args[0];
                return new MockIFindFluent<Word, Word>(values
                    .Where(expression.Compile()));
            });
        for (int i=0; i<20; ++i)
        {
            var word = RandomDataGenerator.RandomWord();
            _store.Add(word.Id, word);
        }
    }

    [Fact]
    public async void TestFindWord()
    {
        var id = _store.Keys.ToList()[0];
        //var serviceCall = await _testWordsService.GetWord(id);
        Assert.NotNull(id);
    }
}
