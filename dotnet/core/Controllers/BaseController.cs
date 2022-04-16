using Microsoft.AspNetCore.Mvc;
using core.Models.Response;

namespace core.Controllers
{
    public class BaseController : ControllerBase {

        [NonAction]
        public ActionResult OkOrError<T> (ExecutionOutcome<T> model) {
            if (model.IsSuccessful) 
            {
                if (model.Data != null)
                    return Ok(model.Data);
            }
            if (model.Exception != null) 
            {
                if (model.Exception is BadHttpRequestException) {
                    return BadRequest(model.Exception.Data);
                }
                if (model.Exception is UnauthorizedAccessException) {
                    return Unauthorized();
                }
            } 
            return StatusCode(500, model.Exception.Message);
        }
    }
}