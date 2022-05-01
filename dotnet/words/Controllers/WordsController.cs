using Microsoft.AspNetCore.Mvc;
using core.Models.Data;
using core.Models.Request;
using core.Models.Response;
using core.Controllers;
using Microsoft.AspNetCore.Authorization;
using core;
using core.Services;

namespace words.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class WordsController : BaseController
    {
        private readonly ServiceFactory serviceFactory;
        private readonly IIdentityService _identityService;

        public WordsController(ServiceFactory serviceFactory, IIdentityService identityService)
        {
            this.serviceFactory = serviceFactory;
            this._identityService = identityService;
        }

        [HttpGet]
        [Authorize]
        public async Task<IActionResult> Get([FromQuery] SearchWordsApiRequest requestBody, int limit = 5, int offset = 0)
        {
            var outcome = await serviceFactory.WordsService().GetWords(limit, offset, requestBody);
            return OkOrError(outcome);
        }

        [HttpGet("range")]
        [Authorize]
        public async Task<IActionResult> GetRange([FromQuery] WordRangeRequest requestBody)
        {
            var outcome = await serviceFactory.WordsService().GetWordsRange(requestBody.Type, requestBody.StartDateParsed.Value, requestBody.EndDateParsed.Value);
            return OkOrError(outcome);
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
        public async Task<IActionResult> SearchWordsNameOnly([FromBody] SearchWordsApiRequest requestBody)
        {
            var outcome = await serviceFactory.WordsService().SearchWordsNameOnly(requestBody);
            return OkOrError(outcome);
        }

        [HttpPost]
        [Authorize]
        public async Task<IActionResult> PostWord([FromBody] Word body) {
            var outcome = await serviceFactory.WordsService().AddWord(body);
            return OkOrError(outcome);
        } 

        [HttpPut]
        [Authorize]
        public async Task<IActionResult> EditWord([FromBody] Word body) {
            var outcome = await serviceFactory.WordsService().EditWord(body);
            return OkOrError(outcome);
        } 

        [HttpDelete("{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteWord(string id) {
            var outcome = await serviceFactory.WordsService().DeleteWord(id);
            return OkOrError(outcome);
        }
    }
}
