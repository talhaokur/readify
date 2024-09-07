class RepositoryAlredyExistsError extends Error {
    constructor(message) {
        super(message);

        this.name = RepositoryAlredyExistsError;
    }
}

export default RepositoryAlredyExistsError;