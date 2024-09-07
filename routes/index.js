import { Router } from 'express';
import articleRoute from './article.route.js';
import generateRoute from './generate.route.js';

const router = Router();

router.get('/', (req, res, next) => {
    return res.status(200).json({ 
        status: 'Success' 
    });
});

router.get('/ping', (req, res, next) => {
    return res.status(200).json({ 
        message: 'Up' 
    });
});

router.use('/api/articles', articleRoute);
router.use('/api/generate', generateRoute);

export default router;