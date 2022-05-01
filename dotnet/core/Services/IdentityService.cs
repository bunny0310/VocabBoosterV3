using System;
using core.Models.Data;

namespace core.Services
{
	public class IdentityService : IIdentityService
	{
		public User User { get; set; }

		public string GetUserId()
        {
			try
            {
				if (User == null)
                {
					throw new Exception("User not found!");
                }
				return User.Id ?? "";
            }
			catch(Exception ex)
            {
				Console.WriteLine(ex);
				return "";
            }
        }
	}
}

