using System.ComponentModel.DataAnnotations;

namespace core.Models.Request
{
    public class AuthenticationRequest
    {
        [EmailAddress]
        public string Email { get; set; }
        public string Password { get; set; }
    }
}