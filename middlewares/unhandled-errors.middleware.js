import { HttpStatusCode } from 'axios';
import BadParamsError from "../errors/bad-params.error.js";
import InvalidRequestError from '../errors/invalid-request.error.js';
import NotImplementedError from '../errors/not-implemented.error.js';
import RepositoryAlredyExistsError from "../errors/repository-already-exists.error.js";
import ResourceNotFound from '../errors/resource-not-found.error.js';

const UnhandledErrorMiddleware = (err, req, res, next) => {
    let statusCode = null;
    let type = null;
    let details = null;
    const stackTrace = err.stack.split("\n").slice(1).join("\n");

    console.error("Error catched: ", err.message, stackTrace);

    switch (err.constructor) {
        case BadParamsError:
        case RepositoryAlredyExistsError:
            statusCode = HttpStatusCode.InternalServerError;
            type = "Internal Error/General";
            details = stackTrace;
            break;
        case NotImplementedError:
            statusCode = HttpStatusCode.NotImplemented;
            type = "Internal Error/Not Implemented Feature";
            break;
        case InvalidRequestError:
            statusCode = HttpStatusCode.BadRequest;
            type = "User Error/Invalid Request";
            break;
        case ResourceNotFound:
            statusCode = HttpStatusCode.NotFound;
            type = "Resource/Not Found";
            break;
        default:
            statusCode = HttpStatusCode.InternalServerError;
            type = "Internal/General";
            details = stackTrace;
    }

    const errorResponse = {
        type: type,
        message: err.message,
        details: details
    }

    return res.status(statusCode).json(errorResponse);
}

export default UnhandledErrorMiddleware;