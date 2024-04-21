import express from 'express';
import { userRoute } from './userRoute';
import { adminRoute } from './adminRoute';
import { viewRoute } from './viewRoute';

const router = express.Router();

router.use('/admin', adminRoute);
router.use('/user', userRoute);
router.use('/view', viewRoute);

export const APIs_V1 = router;
