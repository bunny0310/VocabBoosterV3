using System.ComponentModel.DataAnnotations;

namespace core.Models.Response
{
    public class UserDTO
    {
        [EmailAddress]
        public string Email { get; set; }

        public string FirstName { get; set; }
    }
}