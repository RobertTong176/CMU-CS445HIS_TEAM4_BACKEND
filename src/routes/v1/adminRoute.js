import express from 'express';
import { adminController } from '~/controllers/adminController';
import { authMiddleware } from '~/middlewares/authMiddleware';

const Router = express.Router();

Router.get('/users', authMiddleware, adminController.getAllUsers);
export const adminRoute = Router;
