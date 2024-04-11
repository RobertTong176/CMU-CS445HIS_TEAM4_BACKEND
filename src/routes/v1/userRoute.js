import express from 'express';
import { userValidate } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();

Router.post('/register', userValidate.createNewUser, userController.createNewUser);
Router.post('/login', userValidate.login, userController.login);
Router.get('/id:', userValidate.getUser, userController.getUser);
Router.get('/verify/:id/:token', userValidate.verifyEmail, userController.verifyEmail);
export const userRoute = Router;
