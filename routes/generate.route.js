import { Router } from 'express';
import { PageService } from '../services/page.service.js';
import * as path from 'path';
import { epubService } from '../services/epub.service.js';
import { HttpStatusCode } from 'axios';
import { v4 as uuidv4 } from 'uuid';

const router = Router();
const repository = '/app/output/';

router.post('/', async (req, res, next) => {
    const { url } = req.body;

    if (!url) {
        return res.status(HttpStatusCode.BadRequest).json({ error: 'URL is required' });
    }

    try {
        const jobId = uuidv4();
        const pg = new PageService(url, repository);
        await pg.loadPage();

        const content = pg.article.content;
        const pageTitle = pg.title;

        const options = {
            title: pageTitle,
            author: 'readify',
            publisher: 'Generated by Node.js',
            version: 3,
            content: [
                {
                    title: pageTitle,
                    data: `<div>${content}</div>`,
                },
            ],
            cover: pg._downloadImages[0] || '',
        };

        const epubFilePath = path.join(repository, `${pageTitle}.epub`);
        epubService.generateEpub(options, epubFilePath);
        return res.status(HttpStatusCode.Created).json({jobId: jobId});
    } catch (error) {
        next(error);
    }
});

export default router;