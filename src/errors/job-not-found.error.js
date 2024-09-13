class JobNotFoundError extends Error {
    constructor(message) {
        super(message);
        this.name = "JobNotFoundError";
    }
}

export default JobNotFoundError;