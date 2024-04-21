import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';
import {
    generateAccessToken,
    generateRefreshToken,
    hashPassword,
    isTokenExpired,
    refreshNewToken,
} from '~/utils/algorithms';
import jwt from 'jsonwebtoken';
import { sendEmail } from '~/utils/sendEmail';
import bcrypt from 'bcrypt';

const createNewUser = async (data) => {
    try {
        const userExist = await User.findOne({
            email: data.email,
        });

        if (userExist) {
            throw new ApiError(StatusCodes.CONFLICT, 'User already exists!!');
        }
        const { password } = data;
        const newPassword = await hashPassword(password);
        const response = await User.create({ ...data, password: newPassword });

        //Send email verify
        const emailToken = await jwt.sign(
            {
                id: response._id,
            },
            process.env.EMAIL_TOKEN_SECRET,
            { expiresIn: process.env.EMAIL_TOKEN_EXPIRY },
        );

        response.emailToken = emailToken;
        response.save();

        const EmailMessage = `http://localhost:5173/user/verify/${response._id}/${emailToken}`;
        // const EmailMessage = `${process.env.BASE_URL}/user/verify/${response._id}/${emailToken}`;

        await sendEmail(data.email, 'Verify email', EmailMessage);

        const newUser = response.toObject();
        delete newUser.password;
        return newUser;
    } catch (error) {
        throw error;
    }
};

const getUser = async (userId) => {
    try {
        const user = await User.findById(userId).select('-password');

        return user;
    } catch (error) {
        throw error;
    }
};

const verifyEmail = async (data) => {
    try {
        const { id, token } = data;
        if (isTokenExpired(token)) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Email token has expired');
        }

        const user = await User.findOne({ _id: id, emailToken: token });
        if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'Invalid link ');

        const verified = await User.findOneAndUpdate(
            { _id: id, emailToken: token },
            { $set: { emailToken: '', isVerified: true } },
            { new: true },
        );
        delete verified.toObject().password;
        return verified;
    } catch (error) {
        throw error;
    }
};

const login = async (data) => {
    try {
        const { email, password } = data;
        const user = await User.findOne({ email });
        if (!user) {
            throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
        }
        if (!user.isVerified) {
            throw new ApiError(StatusCodes.UNPROCESSABLE_ENTITY, 'Please verify your account via email.');
        }
        //confirm password saved database
        const isConfirmPassword = await bcrypt.compare(password, user.password);
        if (!isConfirmPassword) {
            throw new ApiError(StatusCodes.UNAUTHORIZED, 'Incorrect password ,please enter again!');
        }

        //create token jwt
        const accessToken = generateAccessToken({ id: user._id, isAdmin: user.isAdmin });
        const refreshToken = generateRefreshToken({ id: user._id, isAdmin: user.isAdmin });
        const newUser = user.toObject();
        delete newUser.password;
        const response = {
            ...newUser,
            accessToken,
            refreshToken,
        };
        return response;
    } catch (error) {
        throw error;
    }
};

const refreshToken = async (data) => {
    try {
        const { refreshToken } = data;
        if (!refreshToken) {
            throw new ApiError(404, 'Refresh token not found!');
        }
        return await refreshNewToken(refreshToken);
    } catch (error) {
        throw error;
    }
};

export const userService = {
    createNewUser,
    getUser,
    verifyEmail,
    login,
    refreshToken,
};
