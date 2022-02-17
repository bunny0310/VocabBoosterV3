namespace core.Models.Response {

    public class ExecutionOutcome {
        public bool IsSuccessful {get; set; }

        public Exception? Exception { get; set; }
    }
    public class ExecutionOutcome<T> : ExecutionOutcome {
        
        public T? Data { get; set; }
    }
}