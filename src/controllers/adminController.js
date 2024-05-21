import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { adminService } from '~/services/adminService';

const getAllUsers = async (req, res, next) => {
    try {
        const response = await adminService.getAllUsers();
        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

const blockUser = async (req, res, next) => {
    try {
        const result = await deleteHumanAndPayroll(id);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        next(error);
    }
};

const deleteHumanAndPayroll = async (req, res, next) => {
    try {
        const response = await adminService.deleteHumanAndPayroll(req.params.id);
        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

export const adminController = {
    getAllUsers,
    blockUser,
    deleteHumanAndPayroll,
};
