using core.Controllers;
using core.Services;
using core.Models.Request;
using Microsoft.AspNetCore.Mvc;
using core;

namespace auth.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class AuthController : BaseController
    {
        private readonly ServiceFactory _serviceFactory;

        public AuthController(ServiceFactory serviceFactory)
        {
            this._serviceFactory = serviceFactory;
        }

        [HttpPost]
        public async Task<IActionResult> Login([FromBody] AuthenticationRequest request) {
            var outcome = await _serviceFactory.UserService().AuthenticateUser(request);
            if (outcome.IsSuccessful && outcome.Data != null) {
                var jwtOutcome = _serviceFactory.TokenService().BuildToken(ConfigurationVariables.JwtKey, ConfigurationVariables.JwtIssuer, outcome.Data);
                return OkOrError(jwtOutcome);
            }
            return OkOrError(outcome);
        }

        [HttpPost("signup")]
        public async Task<IActionResult> Signup([FromBody] SignupRequest request) {
            var outcome = await _serviceFactory.UserService().SignupUser(request);
            if (outcome.IsSuccessful && outcome.Data != null) {
                var jwtOutcome = _serviceFactory.TokenService().BuildToken(ConfigurationVariables.JwtKey, ConfigurationVariables.JwtIssuer, outcome.Data);
                return OkOrError(jwtOutcome);
            }
            return OkOrError(outcome);
        }

        [HttpPost("validate")]
        public async Task<IActionResult> ValidateToken(TokenValidationRequest request) {
            var outcome = _serviceFactory.TokenService().IsTokenValid(ConfigurationVariables.JwtKey ?? "", ConfigurationVariables.JwtIssuer ?? "", request.Token);
            return OkOrError(outcome);
        }
    }
}