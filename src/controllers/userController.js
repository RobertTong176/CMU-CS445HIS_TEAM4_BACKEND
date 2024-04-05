import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { userService } from '~/services/userService';
import { sendEmail } from '~/utils/sendEmail';

const createNewUser = async (req, res, next) => {
    try {
        const newUser = await userService.createNewUser(req.body);
        await sendEmail('truonglamdev070303@gmail.com', 'Xin chao lamtruongdev', 'verify email');
        res.status(StatusCodes.CREATED).json({
            user: newUser,
            message: 'Created new user successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getUser = async (req, res, next) => {
    try {
        const user = await userService.getUser(req.params.id);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found!');
        }
        res.status(StatusCodes.CREATED).json({
            user: user,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {};

export const userController = {
    createNewUser,
    getUser,
    login,
};
