class EpubNotFoundError extends Error {
    constructor(message) {
        super(message);

        this.name = "EpubNotFoundError";
    }
}

export default EpubNotFoundError;