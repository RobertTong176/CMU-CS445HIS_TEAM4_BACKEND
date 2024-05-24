import Joi from 'joi';
import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import { validateObjectId } from '~/utils/algorithms';

const benefitPlan = async (req, res, next) => {
    const benefitPlanSchema = Joi.object({
        BENEFIT_PLANS_ID: Joi.number().integer().required(),
        PLAN_NAME: Joi.string().max(10).required(),
        Deductable: Joi.number().positive().required(),
        Percentage_Copay: Joi.number().integer().positive().required(),
    });
    try {
        await benefitPlanSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }
};

const employeeSchema = Joi.object({
    PERSONAL_ID: Joi.number().integer().required(),
    CURRENT_FIRST_NAME: Joi.string().max(50).required(),
    CURRENT_LAST_NAME: Joi.string().required(),
    CURRENT_MIDDLE_NAME: Joi.string().max(50).optional(),
    BIRTH_DATE: Joi.date().required(),
    SOCIAL_SECURITY_NUMBER: Joi.string().max(20).required(),
    DRIVERS_LICENSE: Joi.string().max(50).required(),
    CURRENT_ADDRESS_1: Joi.string().max(255).required(),
    CURRENT_ADDRESS_2: Joi.string().max(255).optional(),
    CURRENT_CITY: Joi.string().max(100).required(),
    CURRENT_COUNTRY: Joi.string().max(100).required(),
    CURRENT_ZIP: Joi.number().integer().required(),
    CURRENT_GENDER: Joi.string().max(20).required(),
    CURRENT_PHONE_NUMBER: Joi.string().max(15).required(),
    CURRENT_PERSONAL_EMAIL: Joi.string().email().max(50).required(),
    CURRENT_MARITAL_STATUS: Joi.string().max(50).required(),
    ETHNICITY: Joi.string().max(10).required(),
    SHAREHOLDER_STATUS: Joi.number().integer().required(),
    BENEFIT_PLAN_ID: Joi.number().integer().required(),
    PAY_RATE_ID: Joi.number().required('Required').integer(),
    VACATION_DAYS: Joi.number().required('Required').integer(),
    PAID_TO_DATE: Joi.number().required('Required'),
    PAID_LAST_YEAR: Joi.number().required('Required'),
    SNN: Joi.number().required('Required').integer(),
    PAY_RATE: Joi.string().required('Required'),
});

const employeeValidate = async (req, res, next) => {
    try {
        await employeeSchema.validateAsync(req.body, {
            abortEarly: false,
        });
        next();
    } catch (error) {
        const errorMessage = error.details.map((detail) => detail.message).join(', ');
        const customError = new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, errorMessage);
        next(customError);
    }
};
export const adminValidate = {
    benefitPlan,
    employeeValidate,
};
