using System;
namespace words.Models
{
	public class SearchWordsApiRequest
	{
		public bool SearchByName { get; set; }
		public bool SearchByMeaning { get; set; }
		public bool SearchBySentences { get; set; }
		public bool SearchBySynonyms { get; set; }
		public bool SearchByType { get; set; }
		public bool SearchByTags { get; set; }
		public string Name { get; set; }
		public string Meaning { get; set; }
		public List<string> Sentences { get; set; }
		public List<string> Synonyms { get; set; }
		public List<string> Tags { get; set; }
		public string Type { get; set; }
	}
}

