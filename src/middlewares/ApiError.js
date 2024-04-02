import { StatusCodes } from 'http-status-codes';

class ApiError extends Error {
    constructor(statusCode = StatusCodes.INTERNAL_SERVER_ERROR, message) {
        super(message);
        this.name = 'ApiError';
        this.statusCode = statusCode;
        Error.captureStackTrace(this, this.constructor);
    }
}

export default ApiError;
