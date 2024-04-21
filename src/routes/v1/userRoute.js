import express from 'express';
import { userValidate } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';
import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();
Router.get('/verify/:id/:token', userValidate.verifyEmail, userController.verifyEmail);
Router.post('/register', userValidate.createNewUser, userController.createNewUser);
Router.post('/login', userValidate.login, userController.login);
Router.get('/:id', authMiddleware, userValidate.getUser, userController.getUser);
Router.post('/refresh-token', userController.refreshToken)
export const userRoute = Router;
