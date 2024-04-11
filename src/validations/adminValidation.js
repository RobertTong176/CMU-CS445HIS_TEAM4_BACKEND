import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { validateObjectId } from '~/utils/algorithms';



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
