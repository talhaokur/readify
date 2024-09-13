import fs from 'node:fs';
import * as path from 'path';
import { JobModel, JobStatus } from '../models/job.model.js';
import { GLOBALS } from '../configs.js';
import JobNotFoundError from '../errors/job-not-found.error.js';
import { fileService } from './file.service.js';
import ConflicError from '../errors/conflict.error.js';

const getJobRepositoryPath = (jobId) => {
    return path.join(GLOBALS.outputDir, jobId);
}

export const isJobExists = (jobId) => {
    const jobRepository = getJobRepositoryPath(jobId);
    return fs.existsSync(jobRepository);
}

export const isJobRunning = (jobId) => {
    return fileService.isLockFilePresentForJob(jobId);
}

export const isJobFailed = (jobId) => {
    return fileService.isFailMarkFilePresentForJob(jobId);
}

export const getJob = (jobId) => {
    if (!isJobExists(jobId))
        throw new JobNotFoundError(`Job with id:${jobId} not found!`);

    if (isJobRunning(jobId))
        return new JobModel(jobId, JobStatus.RUNNING, null);


    if (isJobFailed(jobId))
        return new JobModel(jobId, JobStatus.FAILED, null);

    const jobArtifact = getJobArtifactPath(jobId);
    return new JobModel(jobId, JobStatus.SUCCESS, jobArtifact);
}

export const deleteJob = (jobId) => {
    if (!isJobExists(jobId))
        throw new JobNotFoundError(`Job with id:${jobId} not found!`);

    if (jobService.isJobRunning(jobId))
        throw new ConflicError(`Job id:${jobId} is still running`);

    fileService.deleteRepository(jobId);
}

const getJobArtifactPath = (jobId) => {
    const jobRepo = getJobRepositoryPath(jobId);

    if (!jobId)
        throw new BadParamsError("jobId cannot be null or empty!");

    const files = fs.readdirSync(jobRepo);
    const epubFiles = files.filter(file => {
        return path.extname(file).toLowerCase() === '.epub';
    });

    if (epubFiles.length === 0)
        throw new ResourceNotFound(`No ePub file four for id:${jobId}`);

    else if (epubFiles.length > 1)
        throw new ConflicError(`More than one ePub file found for id:${jobId}`);

    return path.join(jobRepo, epubFiles[0]);
}