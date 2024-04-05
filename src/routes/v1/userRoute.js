import express from 'express';
import { userValidate } from '~/validations/userValidation';
import { userController } from '~/controllers/userController';

const Router = express.Router();

Router.post('/', userValidate.createNewUser, userController.createNewUser);
Router.get('/:id', userValidate.getUser, userController.getUser);

export const userRoute = Router;
