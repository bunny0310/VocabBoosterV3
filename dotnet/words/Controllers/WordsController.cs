using Microsoft.AspNetCore.Mvc;
using database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using words.Models;

namespace words.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WordsController : ControllerBase
    {
        private readonly ServiceFactory serviceFactory;

        public WordsController(ServiceFactory serviceFactory)
        {
            this.serviceFactory = serviceFactory;
        }
        [HttpGet(Name = "GetWords")]
        public async Task<List<Word>> Get(int limit = 5, int offset = 0)
        {
            var words = await serviceFactory.WordsService().GetWords(limit, offset);
            return words;
        }
        [HttpPost]
        [Route("SearchWordsNameOnly")]
        public async Task<List<string>> SearchWordsNameOnly([FromBody] SearchWordsApiRequest requestBody)
        {
            var words = await serviceFactory.WordsService().SearchWordsNameOnly(requestBody);
            return words;
        }
    }
}
