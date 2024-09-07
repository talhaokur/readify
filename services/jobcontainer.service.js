import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { GLOBALS } from '../configs.js';

class JobContainerService {
    async initializeJob() {
        const jobId = this._generateJobId();
        const jobRepoPath = await this._createJobRepository(jobId);
        await this._createImageRepository(jobId);
        return [jobId, jobRepoPath];
    }

    _generateJobId() {
        return uuidv4();
    }

    _getOutputRepositoryPath() {
        return path.join(GLOBALS.workingDir, 'output');
    }

    async _createJobRepository(jobId) {
        const jobRepoPath = path.join(this._getOutputRepositoryPath(), jobId);
        if (fs.existsSync(jobRepoPath))
            throw new Error(`Job ${jobId} has already a repository.`); // TODO change this to a proper one

        fs.mkdirSync(jobRepoPath);
        console.info(`Job repository is created for jobId:${jobId} path:${jobRepoPath}`);
        return jobRepoPath;
    }

    async _createImageRepository(jobId) {
        const imageRepoPath = path.join(this._getOutputRepositoryPath(), jobId, 'images');
        if (fs.existsSync(imageRepoPath))
            throw new Error(`Image repository is already there for jobId:${jobId}`);  // TODO change this to a proper one
        fs.mkdirSync(imageRepoPath);
        console.info(`Image repository is created for jobId:${jobId}`);
        return imageRepoPath;
    }

    deleteRepository(jobId) {
        if (!jobId)
            throw new Error('jobId cannot be null or empty!'); // TODO change this to a proper one

        const jobRepoPath = path.join(this._getOutputRepositoryPath(), jobId);

        fs.rmSync(jobRepoPath, { recursive: true, force: true });
        console.info(`Job repository deleted successfuly with id: ${jobId}`);
    }

    deleteImageRepositoryForJob(jobId) {
        if (!jobId)
            throw new Error('path cannot be null or empty!'); // TODO change this to a proper one

        const imageRepoPath = path.join(this._getOutputRepositoryPath(), jobId, 'images');
        fs.rmSync(imageRepoPath, {recursive: true, force: true});
        console.info('Image repository is deleted for job:', jobId);
    }
}

export const jobContainerService = new JobContainerService();