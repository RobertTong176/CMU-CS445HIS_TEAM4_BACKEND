import express from 'express';
import { viewController } from '~/controllers/viewController';
import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();
Router.get('/personal', authMiddleware, viewController.getAllPersonal);
Router.get('/employment', authMiddleware, viewController.getAllEmployment);
Router.get('/benefit-plans', authMiddleware, viewController.getAllBenefitPlan);
Router.get('/job-history', authMiddleware, viewController.getAllJobHistory);
Router.get('/employment-working-time', authMiddleware, viewController.getAllEmploymentWorkingTime);
Router.get('/pay-rates', authMiddleware, viewController.getAllPayRates);
Router.get('/employee/birthday', authMiddleware, viewController.getAllEmployeeBirthday);
Router.get('/employee/department', viewController.getAllDepartment);
Router.get('/employee', authMiddleware, viewController.getAllEmployeePayroll);

Router.get('/human/employees', authMiddleware, viewController.filterEmployeeHuman);
Router.get('/payroll/employees', authMiddleware, viewController.filterEmployeePayroll);

export const viewRoute = Router;
