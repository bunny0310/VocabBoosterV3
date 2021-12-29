using System;
namespace words.Models
{
    public class VocabBoosterDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string WordsCollectionName { get; set; } = null!;
    }
}

