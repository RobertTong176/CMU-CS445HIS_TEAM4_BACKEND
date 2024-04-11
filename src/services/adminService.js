import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';
import { generateAccessToken, generateRefreshToken, hashPassword, isTokenExpired } from '~/utils/algorithms';
import jwt from 'jsonwebtoken';
import { sendEmail } from '~/utils/sendEmail';
import bcrypt from 'bcrypt';

const getAllUsers = async () => {};

export const adminService = {
    getAllUsers,
};
