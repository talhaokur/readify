import { HttpStatusCode } from 'axios';
import { Router } from 'express';
import * as jobController from '../../controllers/job.controller.js';
import InvalidRequestError from '../../errors/invalid-request.error.js';
import NotImplementedError from '../../errors/not-implemented.error.js';
import JobModel, { JobStatus } from '../../models/job.model.js';


const router = Router();

function getEntityURL(req, id) {
    const requestUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
    return new URL(`${requestUrl}/${id}`, requestUrl);
}

function validatePostRequestParams(resBody) {
    const { urls, title } = resBody;

    if (!urls) {
        throw new InvalidRequestError("urls cannot be null!");
    }

    if (!urls instanceof Array) {
        throw new InvalidRequestError("urls must be an array!");
    }

    if (urls.length === 0) {
        throw new InvalidRequestError("urls must contain at least one item!");
    }

    if (urls.some(item => item === null || item === "")) {
        throw new InvalidRequestError("urls cannot contain null or empty string values!");
    }

    if (!title) {
        throw new InvalidRequestError("title is mandatory!");
    }
}

router.post('/', async (req, res, next) => {
    try {
        validatePostRequestParams(req.body);
        const jobId = await jobController.createJob(req);
        const job = new JobModel(jobId, JobStatus.RUNNING, null);
        return res.status(HttpStatusCode.Created).json(job);
    } catch (error) {
        next(error);
    }
});

router.get('/', (req, res) => {
    throw new NotImplementedError("this feature is not implemented yet");
});

router.get("/:uuid", async (req, res, next) => {
    try {
        return jobController.getJob(req, res);
    } catch (error) {
        next(error);
    }
});

router.delete("/:uuid", async (req, res, next) => {
    const { uuid } = req.params;

    try {
        await jobController.deleteJob(req, res);
        return res.status(HttpStatusCode.Ok).json({
            message: `Job ${uuid} deleted successfully`
        });
    } catch (error) {
        next(error);
    }
});

export default router;
