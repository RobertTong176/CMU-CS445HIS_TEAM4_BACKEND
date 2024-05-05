import { StatusCodes } from 'http-status-codes';
import { viewService } from '~/services/viewService';

const getAllPersonal = async (req, res, next) => {
    try {
        const response = await viewService.getAllPersonal();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllEmployment = async (req, res, next) => {
    try {
        const response = await viewService.getAllEmployment();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllBenefitPlan = async (req, res, next) => {
    try {
        const response = await viewService.getAllBenefitPlan();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllJobHistory = async (req, res, next) => {
    try {
        const response = await viewService.getAllJobHistory();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllEmploymentWorkingTime = async (req, res, next) => {
    try {
        const response = await viewService.getAllEmploymentWorkingTime();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};
const getAllPayRates = async (req, res, next) => {
    try {
        const response = await viewService.getAllPayRates();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllEmployeePayroll = async (req, res, next) => {
    try {
        const response = await viewService.getAllEmployeePayroll();

        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const filterEmployeeHuman = async (req, res, next) => {
    try {
        const response = await viewService.filterEmployeeHuman(req.query);
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const filterEmployeePayroll = async (req, res, next) => {
    try {
        const response = await viewService.filterEmployeeHuman(req.query);
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllEmployeeBirthday = async (req, res, next) => {
    try {
        const response = await viewService.getAllEmployeeBirthday(req.query);
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

const getAllDepartment = async (req, res, next) => {
    try {
        const response = await viewService.getAllDepartment();
        res.status(StatusCodes.CREATED).json({
            data: response,
            message: 'Successfully',
        });
    } catch (error) {
        next(error);
    }
};

export const viewController = {
    getAllPersonal,
    getAllEmployment,
    getAllBenefitPlan,
    getAllJobHistory,
    getAllEmploymentWorkingTime,
    getAllPayRates,
    getAllEmployeePayroll,
    filterEmployeeHuman,
    filterEmployeePayroll,
    getAllEmployeeBirthday,
    getAllDepartment,
};
