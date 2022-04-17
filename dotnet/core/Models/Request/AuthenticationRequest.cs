using System.ComponentModel.DataAnnotations;

namespace core.Models.Request
{
    public class AuthenticationRequest
    {
        [EmailAddress, Required]
        public string Email { get; set; }

        [Required]
        public string Password { get; set; }
    }
}