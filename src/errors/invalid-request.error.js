class InvalidRequestError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidRequestError';
    }
}

export default InvalidRequestError;