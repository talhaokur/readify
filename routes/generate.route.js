import { Router } from 'express';
import { HttpStatusCode } from 'axios';

const router = Router();

router.post('/', (req, res) => {
    const { url } = req.body;
    if (!url)
        return res.status(HttpStatusCode.BadRequest).json({message: 'url cannot be null or empty!'});
    return res.status(HttpStatusCode.NotImplemented).json();
});

export default router;