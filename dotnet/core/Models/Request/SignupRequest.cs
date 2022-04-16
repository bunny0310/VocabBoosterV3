using System.ComponentModel.DataAnnotations;

namespace core.Models.Request
{
    public class SignupRequest : AuthenticationRequest
    {
        [Required]
        public string FirstName { get; set; }

        [Required]
        public string LastName { get; set; }
    }
}