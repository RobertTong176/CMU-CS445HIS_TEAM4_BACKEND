import jwt from 'jsonwebtoken';
import ApiError from './ApiError';
import { StatusCodes } from 'http-status-codes';
import { validateObjectId } from '~/utils/algorithms';
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers?.authorization.split(' ')[1];
        if (!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication failed. Token is missing.');
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                throw new ApiError(419, 'Token expired!');
            }
            if (user && validateObjectId(user.id)) {
                req.user = {
                    id: user.id,
                    isAdmin: user.isAdmin,
                };
                next();
            } else {
                throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access');
            }
        });
    } catch (error) {
        next(error);
    }
};

export const authorizeUser = (req, res, next) => {
    try {
        const token = req.headers?.authorization.split(' ')[1];
        if (!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication failed. Token is missing.');
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                throw new ApiError(419, 'Token expired!');
            }
            if (user && validateObjectId(user.id) && user.isAdmin) {
                req.user = {
                    id: user.id,
                    isAdmin: user.isAdmin,
                };
                next();
            } else {
                throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized access.');
            }
        });
    } catch (error) {
        next(error);
    }
};
