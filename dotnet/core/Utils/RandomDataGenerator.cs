using System;
using core.Models.Data;
using Faker;
using System.Linq;
using MongoDB.Bson;

namespace core.Utils
{
	public class RandomDataGenerator
	{
		private static Random _random = new Random();

		public static Word RandomWord()
        {
			var word = new Word()
			{
				Id = ObjectId.GenerateNewId().ToString(),
				UserId = ObjectId.GenerateNewId().ToString(),
				Name = Faker.Lorem.GetFirstWord(),
				Meaning = Faker.Lorem.Paragraph().Substring(0, 15),
				Sentences = Faker.Lorem.Sentences(3).ToList(),
				Synonyms = Faker.Lorem.Words(3).ToList(),
				Tags = Faker.Lorem.Words(3).ToList(),
				Types = new List<string>() { System.Enum.GetNames(typeof(WordType)).ToList()[_random.Next(6)] }
			};
			return word;
        }

	}
}

