using System;
using words.Models;

namespace words.Util
{
	public static class HelperMethods
	{
		public static SearchWordsApiRequest GenerateSearchWordsApiRequest(bool searchByName, bool searchByMeaning, bool searchBySentences, bool searchBySynonyms, bool searchByTags, string q)
        {
			return new SearchWordsApiRequest()
			{
				SearchByName = searchByName,
				SearchByMeaning = searchByMeaning,
				SearchBySentences = searchBySentences,
				SearchBySynonyms = searchBySynonyms,
				SearchByTags = searchByTags,
				SearchValue = q
			}; 
        }
	}
}

