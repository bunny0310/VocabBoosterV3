using System;
using core.Models.Data;

namespace core.Services
{
	public interface IIdentityService
	{
		public User User { get; set; }
		public string GetUserId();
	}
}

