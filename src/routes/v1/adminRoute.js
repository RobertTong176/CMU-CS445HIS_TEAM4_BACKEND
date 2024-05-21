import express from 'express';
import { adminController } from '~/controllers/adminController';
import { authMiddleware, authorizeUser } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.get('/users', adminController.getAllUsers);
// Router.get('/users', authorizeUser, adminController.getAllUsers);
Router.post('/user/:id', authorizeUser, adminController.blockUser);

Router.post('/employee/:id', adminController.deleteHumanAndPayroll);
export const adminRoute = Router;
