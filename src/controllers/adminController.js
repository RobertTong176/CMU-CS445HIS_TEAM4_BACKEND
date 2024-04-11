import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { adminService } from '~/services/adminService';

const getAllUsers = async () => {
    const response = await adminService.getAllUsers();
};

export const adminController = {
    getAllUsers,
};
