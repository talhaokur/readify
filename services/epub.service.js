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
}

export const epubService = new EpubService();