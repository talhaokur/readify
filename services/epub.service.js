import fs from 'node:fs';
import path from 'path';
const { default: Epub } = await import('epub-gen');

class EpubService {
    async generateEpub(options, epubFilePath) {
        if (!options || !epubFilePath) {
            throw new Error(); // TODO change this to a proper error
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

    getEpubFilePath(jobRepo) {
        if (!jobRepo)
            throw new Error(); // TODO change this to a proper error

        const files = fs.readdirSync(jobRepo);
        const epubFiles = files.filter(file => {
            return path.extname(file).toLowerCase() === '.epub';
        });

        if (epubFiles.length === 0) {
            console.log("No epub file found!");
            return null;
        }
        else if (epubFiles.length > 1)
            throw new Error(); // TODO change this to a proper error

        return path.join(jobRepo, epubFiles[0]);
    }
}

export const epubService = new EpubService();