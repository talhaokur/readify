class BadParamsError extends Error {
    constructor(message) {
        super(message);

        this.name = "BadParamsError";
    }
}

export default BadParamsError;