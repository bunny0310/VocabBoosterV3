namespace core
{
    public static class ConfigurationVariables
    {
        public static string? MongoConnectionString = Environment.GetEnvironmentVariable("MongoConnectionString");
        public static string? MongoDb = Environment.GetEnvironmentVariable("MongoDbName");
        public static string? JwtKey = Environment.GetEnvironmentVariable("JwtKey");
        public static string? JwtIssuer = Environment.GetEnvironmentVariable("JwtIssuer");

        public static string? PathName = Directory.GetCurrentDirectory();
    }
}