import jwt from 'jsonwebtoken';
import ApiError from './ApiError';
import { StatusCodes } from 'http-status-codes';
export const authMiddleware = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication failed. Token is missing.');
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                throw error;
            } else if (user) {
                console.log(user);
                next();
            }
        });
    } catch (error) {
        next(error);
    }
};

export const authorizeUser = () => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        if (!token) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Authentication failed. Token is missing.');
        }
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
            if (error) {
                throw error;
            } else if (user) {
                console.log(user);
                next();
            }
        });
    } catch (error) {
        next(error);
    }
};
