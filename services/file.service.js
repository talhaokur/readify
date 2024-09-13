import fs from 'node:fs';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { GLOBALS } from '../configs.js';
import RepositoryAlredyExistsError from '../errors/repository-already-exists.error.js';
import BadParamsError from '../errors/bad-params.error.js';
import ResourceNotFound from '../errors/resource-not-found.error.js';

class FileService {
    async initializeJob(jobId) {
        const jobRepoPath = await this._createJobRepository(jobId);
        const lockFilePath = path.join(jobRepoPath, ".lock");
        this._createFile(lockFilePath);
        await this._createImageRepository(jobId);

        return jobRepoPath;
    }

    _generateJobId() {
        return uuidv4();
    }

    _getOutputRepositoryPath() {
        return path.join(GLOBALS.workingDir, 'output');
    }

    _createFile(path) {
        fs.closeSync(
            fs.openSync(path, 'w')
        );
    }

    _removeFile(path) {
        fs.unlinkSync(path);
    }

    getJobRepositoryPath(jobId) {
        return path.join(this._getOutputRepositoryPath(), jobId);
    }

    markJobRepository(jobId) {
        try {
            const failMarkFilePath = path.join(this.getJobRepositoryPath(jobId), '.failed');
            this._createFile(failMarkFilePath);
            console.info('Marked repository as failed. jobId:', jobId);
        } catch (error) {
            console.error("Error during marking the job repository", error.message);
        }
    }

    async cleanUpRepository(jobId) {
        this.deleteImageRepositoryForJob(jobId);
        const lockFilePath = path.join(this.getJobRepositoryPath(jobId), ".lock");
        this._removeFile(lockFilePath);
    }

    async _createJobRepository(jobId) {
        const jobRepoPath = this.getJobRepositoryPath(jobId);
        if (fs.existsSync(jobRepoPath))
            throw new RepositoryAlredyExistsError(`Job ${jobId} has already a repository.`);

        fs.mkdirSync(jobRepoPath);
        console.info(`Job repository is created for jobId:${jobId} path:${jobRepoPath}`);
        return jobRepoPath;
    }

    async _createImageRepository(jobId) {
        const imageRepoPath = path.join(this.getJobRepositoryPath(jobId), 'images');
        if (fs.existsSync(imageRepoPath))
            throw new RepositoryAlredyExistsError(`Image repository is already there for jobId:${jobId}`);

        fs.mkdirSync(imageRepoPath);
        console.info(`Image repository is created for jobId:${jobId}`);
        return imageRepoPath;
    }

    deleteRepository(jobId) {
        if (!jobId)
            throw new BadParamsError('jobId cannot be null or empty!');

        const jobRepoPath = this.getJobRepositoryPath(jobId);

        if (!fs.existsSync(jobRepoPath)) 
            throw new ResourceNotFound(`No repository found for id:${jobId}`);

        fs.rmSync(jobRepoPath, { recursive: true, force: true });
        console.info(`Job repository deleted successfuly with id: ${jobId}`);
    }

    deleteImageRepositoryForJob(jobId) {
        if (!jobId)
            throw new BadParamsError('path cannot be null or empty!');

        const imageRepoPath = path.join(this.getJobRepositoryPath(jobId), 'images');
        fs.rmSync(imageRepoPath, { recursive: true, force: true });
        console.info('Image repository is deleted for job:', jobId);
    }

    isFileExists(path) {
        try {
            return fs.existsSync(path);
        } catch (error) {
            console.error("error while checking if file exists on fs.", error.message);
            return false;
        }
    }

    isLockFilePresentForJob(jobId) {
        const lockFilePath = path.join(this.getJobRepositoryPath(jobId), ".lock");
        return this.isFileExists(lockFilePath);
    }

    isFailMarkFilePresentForJob(jobId) {
        const failMarkFilePath = path.join(this.getJobRepositoryPath(jobId), '.failed');
        return this.isFileExists(failMarkFilePath);
    }
}

export const fileService = new FileService();