import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';
import { hashPassword } from '~/utils/algorithms';

const createNewUser = async (data) => {
    try {
        const userExist = await User.findOne({
            email: data.email,
        });

        if (userExist) {
            throw new ApiError(StatusCodes.CONFLICT, 'User already exists!!');
        }
        const { password } = data;
        const newPassword = await hashPassword(password);
        const response = await User.create({ ...data, password: newPassword });
        const newUser = response.toObject();
        delete newUser.password;
        return newUser;
    } catch (error) {
        throw error;
    }
};

const getUser = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');

        return user;
    } catch (error) {
        throw error;
    }
};

export const userService = {
    createNewUser,
    getUser,
};
