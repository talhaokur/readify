class ConflicError extends Error {
    constructor(message) {
        super(message);
        this.name = 'ConflicError';
    }
}

export default ConflicError;