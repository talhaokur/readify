class ResourceNotFound extends Error {
    constructor(message) {
        super(message);

        this.name = "ResourceNotFound";
    }
}

export default ResourceNotFound;