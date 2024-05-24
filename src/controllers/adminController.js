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
        const result = await blockUser(id);
        res.status(result.status).json({ message: result.message });
    } catch (error) {
        next(error);
    }
};

const deleteEmployee = async (req, res, next) => {
    try {
        const response = await adminService.deleteEmployee(req.params.id);
        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

const addBenefitPlan = async (req, res, next) => {
    try {
        const response = await adminService.addBenefitPlan(req);
        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

const addNewEmployee = async (req, res, next) => {
    try {
        const response = await adminService.addNewEmployee(req);
        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};


const checkVacationDay = async (req, res, next) => {
    try {
        const response = await adminService.checkVacationDay(req.params.days);
        res.status(StatusCodes.CREATED).json(response);
    } catch (error) {
        next(error);
    }
};

export const adminController = {
    getAllUsers,
    blockUser,
    deleteEmployee,
    addBenefitPlan,
    addNewEmployee,
    checkVacationDay,
};
