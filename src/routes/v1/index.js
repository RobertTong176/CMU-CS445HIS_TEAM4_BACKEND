import express from 'express';
import { userRoute } from './userRoute';
import { adminRoute } from './adminRoute';

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/user', userRoute);

export const APIs_V1 = router;
