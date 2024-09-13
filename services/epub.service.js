import BadParamsError from '../errors/bad-params.error.js';

const { default: Epub } = await import('epub-gen');

export const generateEpub = async (options, epubFilePath) => {
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