import fs from 'node:fs';
import path from 'path';
import BadParamsError from '../errors/bad-params.error.js';
import ConflicError from '../errors/conflict.error.js';
import ResourceNotFound from '../errors/resource-not-found.error.js';
const { default: Epub } = await import('epub-gen');

class EpubService {
    async generateEpub(options, epubFilePath) {
        if (!options || !epubFilePath) {
            throw new BadParamsError("options or epubFilePath cannot be null or empty!");
        }
        console.debug(`epubFilePath is ${epubFilePath}`);
        return await new Epub(options, epubFilePath).promise
            .then(() => {
                console.log(`Epub created successfuly under ${epubFilePath}`);
            })
            .catch((err) => {
                console.error(err); 
                throw err;
            });
    }

    getEpubFilePath(uuid, jobRepo) {
        if (!uuid || !jobRepo)
            throw new BadParamsError("uuid and jobRepo cannot be null or empty!");

        const files = fs.readdirSync(jobRepo);
        const epubFiles = files.filter(file => {
            return path.extname(file).toLowerCase() === '.epub';
        });

        if (epubFiles.length === 0) {
            throw new ResourceNotFound(`No ePub file four for id:${uuid}`);
        }
        else if (epubFiles.length > 1)
            throw new ConflicError(`More than one ePub file found for id:${uuid}`);

        return path.join(jobRepo, epubFiles[0]);
    }
}

export const epubService = new EpubService();