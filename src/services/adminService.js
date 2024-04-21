import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';

const getAllUsers = async () => {
    try {
        const users = await User.find().select('-password');
        return {
            data: users || [],
            message: 'Successfully',
        };
    } catch (error) {
        throw error;
    }
};

const blockUser = async (userId) => {
    try {
        const user = await User.findById(userId);
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        user.isBlock = true;
        user.save();
        return {
            message: 'Block user successfully',
        };
    } catch (error) {
        throw error;
    }
};

export const adminService = {
    getAllUsers,
    blockUser,
};
