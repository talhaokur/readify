class RepositoryNotFoundError extends Error {
    constructor(message) {
        super(message);

        this.name = "RepositoryNotFoundError";
    }
}

export default RepositoryNotFoundError;