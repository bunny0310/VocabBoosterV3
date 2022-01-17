namespace core.Models.Data
{
    public class VocabBoosterDatabaseSettings
    {
        public string ConnectionString { get; set; } = null!;

        public string DatabaseName { get; set; } = null!;

        public string WordsCollectionName { get; set; } = null!;
    }
}

