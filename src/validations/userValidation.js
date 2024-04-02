import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';

const createNewUser = async (req, res, next) => {
    const correctCondition = Joi.object({
        email: Joi.string().required().email().trim().strict(),
        password: Joi.string()
            .required()
            .regex(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,1024}$/)
            .trim()
            .strict()
            .label('Password')
            .messages({
                'object.regex': 'Password must include capital letters, numbers and special characters',
            }),
    });

    try {
        await correctCondition.validateAsync(req.body, {
            abortEarly: false,
        });
        res.status(StatusCodes.CREATED).json({ message: 'created new user' });
    } catch (error) {
        console.log(error);
        const errorMessage = new Error(error).message;
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }
};

export const userValidate = {
    createNewUser,
};
