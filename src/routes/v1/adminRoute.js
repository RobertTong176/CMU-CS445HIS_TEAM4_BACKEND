import express from 'express';
import { adminController } from '~/controllers/adminController';
import { authMiddleware, authorizeUser } from '~/middlewares/authMiddleware';
import { adminValidate } from '~/validations/adminValidation';

const Router = express.Router();

Router.get('/users', adminController.getAllUsers);
// Router.get('/users', authorizeUser, adminController.getAllUsers);
Router.post('/user/:id', authorizeUser, adminController.blockUser);

Router.post('/employee/:id', authorizeUser, adminController.deleteEmployee);
Router.post('/benefit-plans', authorizeUser, adminValidate.benefitPlan, adminController.addBenefitPlan);
Router.post('/create-employee', authorizeUser, adminValidate.employeeValidate, adminController.addNewEmployee);
Router.get('/check-vacation-days', authorizeUser, adminController.checkVacationDay);

export const adminRoute = Router;
