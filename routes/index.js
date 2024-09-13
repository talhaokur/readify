import { Router } from 'express';
import jobsRouteV1 from './v1/jobs.route.js';

export const router = Router();
export const v1Router = Router();

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

v1Router.use('/jobs', jobsRouteV1);