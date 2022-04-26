using core.Models.Data;

namespace core.Models.Request
{
    public class WordRangeRequest 
    {
        public WordType Type { get; set; }
        public string StartDate { get; set; }
        public string EndDate { get; set; }
        public DateTime? StartDateParsed => DateTime.Parse(StartDate);
        public DateTime? EndDateParsed => DateTime.Parse(EndDate);
    }
}