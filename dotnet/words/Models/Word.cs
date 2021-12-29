using System;
using System.Collections.Generic;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace database.Models {
    public enum WordType {
        Adverb,
        Adjective,
        Excerpt,
        Expression,
        Noun,
        Verb
    }
    public class Word
    {
        [BsonId]
        [BsonRepresentation(BsonType.ObjectId)]
        public string Id { get; set; }

        [BsonElement("createdAt")]
        public DateTime CreatedAt { get; set; } =  DateTime.UtcNow;

        [BsonElement("updatedAt")]
        public DateTime UpdatedAt { get; set; } =  DateTime.UtcNow;
            
        [BsonElement("name")]
        public string Name { get; set; }

        [BsonRepresentation(BsonType.ObjectId)]
        [BsonElement("user")]
        public string UserId { get; set; }

        [BsonElement("meaning")]
        public string Meaning {get; set;}

        [BsonElement("synonyms")]
        public List<string> Synonyms { get; set; }

        [BsonElement("tags")]
        public List<string> Tags {get; set;}

        [BsonElement("sentences")]
        public List<string> Sentences {get; set;}

        [BsonElement("types")]
        public List<string> Types {get; set;}

        [BsonElement("__v")]
        public int V { get; set; }

    }
}