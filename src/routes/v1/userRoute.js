import express from 'express';
import { userValidate } from '~/validations/userValidation';

const Router = express.Router();

Router.post('/', userValidate.createNewUser);

export const userRoute = Router;
