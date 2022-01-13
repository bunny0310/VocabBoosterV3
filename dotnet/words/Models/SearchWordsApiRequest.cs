using System;
namespace words.Models
{
	public class SearchWordsApiRequest
	{
		public bool? Filter {get; set; }
		public bool? SearchByName { get; set; }
		public bool? SearchByMeaning { get; set; }
		public bool? SearchBySentences { get; set; }
		public bool? SearchBySynonyms { get; set; }
		public bool? SearchByType { get; set; }
		public bool? SearchByTags { get; set; }
		public string? SearchValue { get; set; }
	}
}

