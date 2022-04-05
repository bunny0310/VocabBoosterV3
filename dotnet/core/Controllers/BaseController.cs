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
                    return BadRequest();
                }
                if (model.Exception is UnauthorizedAccessException) {
                    Console.WriteLine("ishaan");
                    return Unauthorized();
                }
            } 
            Console.WriteLine("ishaan");
            return StatusCode(500, model.Exception.Message);
        }

        public Redirect Register(string email, string password)
        {
            return Redirect();
        }
    }
}