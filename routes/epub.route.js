import { Router } from 'express';
import { HttpStatusCode } from 'axios';
import fs from 'node:fs';
import path from 'path';
import { GLOBALS } from '../configs.js';
import { epubService } from '../services/epub.service.js';

const router = Router();

function isValidUUID(uuid) {
    const regex = /^[0-9a-f]{8}-[0-9a-f]{4}-[4][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return regex.test(uuid);
}

router.get('/', (req, res) => {
    // TODO
    return res.status(HttpStatusCode.NotImplemented).json();
});

router.get("/:uuid", async (req, res, next) => {
    const { uuid } = req.params;
    if (!isValidUUID(uuid))
        return res.status(HttpStatusCode.BadRequest).json({ message: `Given id is not valid` });
    const jobRepository = path.join(GLOBALS.outputDir, uuid);

    if (!fs.existsSync(jobRepository))
        return res.status(HttpStatusCode.NotFound).json();

    const epubPath = epubService.getEpubFilePath(jobRepository, (p) => { return p; });

    if (!epubPath)
        return res.status(HttpStatusCode.NotFound).json({ message: "No ePub found!" });
    
    return res.download(epubPath);
});

router.delete("/:uuid", (req, res) => {
    const { uuid } = req.params;
    if (!isValidUUID(uuid))
        return res.status(HttpStatusCode.BadRequest).json({ message: `Given id is not valid` });
    return res.status(HttpStatusCode.NotImplemented).json();
});

export default router;