import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { GLOBALS } from '../configs.js';

class JobContainerService {
    constructor() {
        this.mainRepository = path.join(GLOBALS.workingDir, 'output');
        console.log(`main repo is ${this.mainRepository}`);
    }

    async initializeJob() {
        const jobId = this._generateJobId();
        const jobRepoPath = await this._createJobRepository(jobId);
        await this._createImageRepository(jobId);
        return [jobId, jobRepoPath];
    }

    _generateJobId() {
        return uuidv4();
    }

    async _createJobRepository(jobId) {
        const jobRepoPath = path.join(this.mainRepository, jobId);
        if (fs.existsSync(jobRepoPath))
            throw new Error(`Job ${jobId} has already a repository.`); // TODO change this to a proper one

        fs.mkdirSync(jobRepoPath);
        console.info(`Job repository is created for jobId:${jobId}`);
        return jobRepoPath;
    }

    async _createImageRepository(jobId) {
        const imageRepoPath = path.join(this.mainRepository, jobId, 'images');
        if (fs.existsSync(imageRepoPath))
            throw new Error(`Image repository is already there for jobId:${jobId}`);  // TODO change this to a proper one
        fs.mkdirSync(imageRepoPath);
        console.info(`Image repository is created for jobId:${jobId}`);
        return imageRepoPath;
    }

    deleteRepository(jobId) {
        if (!jobId)
            throw new Error('jobId cannot be null or empty!'); // TODO change this to a proper one

        const jobRepoPath = path.join(this.mainRepository, jobId);

        fs.rmSync(jobRepoPath, { recursive: true, force: true });
        console.info(`Job repository deleted successfuly with id: ${jobId}`);
    }
}

export const jobContainerService = new JobContainerService();