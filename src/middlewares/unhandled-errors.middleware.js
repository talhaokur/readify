import { HttpStatusCode } from 'axios';
import BadParamsError from "../errors/bad-params.error.js";
import InvalidRequestError from '../errors/invalid-request.error.js';
import NotImplementedError from '../errors/not-implemented.error.js';
import RepositoryAlredyExistsError from "../errors/repository-already-exists.error.js";
import ResourceNotFound from '../errors/resource-not-found.error.js';
import InvalidIdError from '../errors/invalid-id.error.js';
import JobNotFoundError from '../errors/job-not-found.error.js';
import ConflicError from '../errors/conflict.error.js';

const UnhandledErrorMiddleware = (err, req, res, next) => {
    let statusCode = null;
    let type = null;
    let details = null;
    let needsPrintingStackTrace = false;
    const stackTrace = err.stack.split("\n").slice(1).join("\n");

    switch (err.constructor) {
        case BadParamsError:
        case RepositoryAlredyExistsError:
            statusCode = HttpStatusCode.InternalServerError;
            type = "Internal Error/General";
            details = stackTrace;
            needsPrintingStackTrace = true;
            break;
        case NotImplementedError:
            statusCode = HttpStatusCode.NotImplemented;
            type = "Internal Error/Not Implemented Feature";
            break;
        case InvalidRequestError:
        case InvalidIdError:
            statusCode = HttpStatusCode.BadRequest;
            type = "User Error/Invalid Request";
            break;
        case ResourceNotFound:
        case JobNotFoundError:
            statusCode = HttpStatusCode.NotFound;
            type = "Resource/Not Found";
            break;
        case ConflicError:
            statusCode = HttpStatusCode.Conflict;
            type = "UserError/Job Still Running";
            break;
        default:
            statusCode = HttpStatusCode.InternalServerError;
            type = "Internal/General";
            details = stackTrace;
            needsPrintingStackTrace = true;
    }

    if (needsPrintingStackTrace) {
        console.error("Error catched: ", err.message, stackTrace);
    }
    else {
        console.error("Error catched: ", err.message);
    }

    const errorResponse = {
        type: type,
        message: err.message,
        details: details
    }

    return res.status(statusCode).json(errorResponse);
}

export default UnhandledErrorMiddleware;