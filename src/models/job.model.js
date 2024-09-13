export class JobModel {
    constructor(id, status, artifactPath) {
        this.id = id;
        this.status = status;
        this.artifactPath = artifactPath;
    }
}

export const JobStatus = Object.freeze({
    RUNNING: "RUNNING",
    SUCCESS: "SUCCESS",
    FAILED: "FAILED"
});

export default JobModel;