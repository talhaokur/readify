import { HttpStatusCode } from "axios";
import { v4 } from "uuid";
import InvalidIdError from "../errors/invalid-id.error.js";
import { JobStatus } from '../models/job.model.js';
import * as jobService from "../services/job.service.js";

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

export const createJob = async (req) => {
    const { urls, title, author, coverImageUrl } = req.body;
    const jobId = v4();
    jobService.runJob(jobId, urls, title, author, coverImageUrl);
    return jobId;
};

export const getJob = (req, res) => {
    const { uuid } = req.params;

    // TODO move this part to validators
    if (!isValidUUID(uuid))
        throw new InvalidIdError(`${uuid} is invalid`);

    const job = jobService.getJob(uuid);

    switch (job.status) {
        case JobStatus.SUCCESS:
            return res.download(job.artifactPath);
        case JobStatus.FAILED:
            return res.status(HttpStatusCode.Ok).json(job);
        case JobStatus.RUNNING:
            return res.status(HttpStatusCode.Accepted).json(job);
    }
};

export const deleteJob = async (req, res) => {
    const { uuid } = req.params;

    // TODO move this part to validators
    if (!isValidUUID(uuid))
        return res.status(HttpStatusCode.BadRequest).json({
            message: `Given id is not valid`
        });

    await jobService.deleteJob(uuid);
};