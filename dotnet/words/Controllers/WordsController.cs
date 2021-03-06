using Microsoft.AspNetCore.Mvc;
using core.Models.Data;
using core.Models.Request;
using core.Models.Response;
using core.Controllers;
using Microsoft.AspNetCore.Authorization;
using core;

namespace words.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WordsController : BaseController
    {
        private readonly ServiceFactory serviceFactory;

        public WordsController(ServiceFactory serviceFactory)
        {
            this.serviceFactory = serviceFactory;
        }
        [HttpGet]
        [Authorize]
        public async Task<List<Word>> Get([FromQuery] SearchWordsApiRequest requestBody, int limit = 5, int offset = 0)
        {
            Console.WriteLine(ConfigurationVariables.JwtIssuer);
            return await serviceFactory.WordsService().GetWords(limit, offset, requestBody);
        }

        [HttpGet("{id}")]
        [Authorize]
        public async Task<IActionResult> Get(string id)
        {
            var outcome = await serviceFactory.WordsService().GetWord(id);
            return OkOrError(outcome);
        }

        [HttpPost]
        [Authorize]
        [Route("SearchWordsNameOnly")]
        public async Task<List<SearchWordResponse>> SearchWordsNameOnly([FromBody] SearchWordsApiRequest requestBody)
        {
            var words = await serviceFactory.WordsService().SearchWordsNameOnly(requestBody);
            return words;
        }

        [HttpPost]
        public async Task<Word> PostWord([FromBody] Word body) {
            var word = await serviceFactory.WordsService().AddWord(body);
            return word;
        } 

        [HttpPut]
        public async Task<IActionResult> EditWord([FromBody] Word body) {
            var outcome = await serviceFactory.WordsService().EditWord(body);
            return OkOrError(outcome);
        } 
    }
}
