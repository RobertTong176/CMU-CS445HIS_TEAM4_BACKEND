import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { userService } from '~/services/userService';

const createNewUser = async (req, res, next) => {
    try {
        const newUser = await userService.createNewUser(req.body);
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

const verifyEmail = async (req, res, next) => {
    try {
        const user = await userService.verifyEmail(req.params);
        res.status(StatusCodes.CREATED).json({
            user: user,
            message: 'Verified successfully',
        });
    } catch (error) {
        next(error);
    }
};

const login = async (req, res, next) => {
    try {
        const user = await userService.login(req.body);
        res.status(StatusCodes.CREATED).json({
            user: user,
            message: 'Login successfully',
        });
    } catch (error) {
        next(error);
    }
};

const refreshToken = async (req, res, next) => {
    try {
        const response = await userService.refreshToken(req.body);
        res.status(StatusCodes.CREATED).json({
            accessToken: response,
            message: 'Refresh token successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const userController = {
    createNewUser,
    getUser,
    verifyEmail,
    login,
    refreshToken,
};
