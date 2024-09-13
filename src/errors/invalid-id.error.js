class InvalidIdError extends Error {
    constructor(message) {
        super(message);
        this.name = 'InvalidIdError';
    }
}

export default InvalidIdError;