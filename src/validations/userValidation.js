import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { validateObjectId } from '~/utils/algorithms';

const createNewUser = async (req, res, next) => {
    const correctCondition = Joi.object({
        name: Joi.string().required().trim().strict().messages({}),
        email: Joi.string().required().email().trim().strict(),
        password: Joi.string()
            .required()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
            .trim()
            .strict()
            .label('Password')
            .messages({
                'string.regex': 'Password must include capital letters, numbers and special characters',
            }),
    });

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (error) {
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }
};

const getUser = async (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!validateObjectId(userId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'User Id is required!');
        }
        next();
    } catch (error) {
        next(error);
    }
};

const verifyEmail = (req, res, next) => {
    try {
        const userId = req.params.id;
        if (!validateObjectId(userId)) {
            throw new ApiError(StatusCodes.BAD_REQUEST, 'User Id is required!');
        }
        next();
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().required().email().trim().strict(),
        password: Joi.string().required().trim().strict(),
    });
    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (error) {
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }
};
export const userValidate = {
    createNewUser,
    getUser,
    verifyEmail,
    login,
};
