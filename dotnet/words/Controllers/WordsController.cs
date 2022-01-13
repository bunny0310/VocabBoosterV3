using Microsoft.AspNetCore.Mvc;
using database.Models;
using System.Collections.Generic;
using System.Threading.Tasks;
using words.Models;
using words.Util;

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
        [HttpGet]
        public async Task<List<Word>> Get([FromQuery] SearchWordsApiRequest requestBody, int limit = 5, int offset = 0)
        {
            return await serviceFactory.WordsService().GetWords(limit, offset, requestBody);
        }
        [HttpPost]
        [Route("SearchWordsNameOnly")]
        public async Task<List<string>> SearchWordsNameOnly([FromBody] SearchWordsApiRequest requestBody)
        {
            var words = await serviceFactory.WordsService().SearchWordsNameOnly(requestBody);
            return words;
        }

        [HttpPost]
        public async Task<Word> PostWord([FromBody] Word body) {
            var word = await serviceFactory.WordsService().AddWord(body);
            return word;
        } 
    }
}
