import { StatusCodes } from 'http-status-codes';
import ApiError from '~/middlewares/ApiError';
import User from '~/models/userModel';
import { hashPassword, isTokenExpired } from '~/utils/algorithms';
import jwt from 'jsonwebtoken';
import { sendEmail } from '~/utils/sendEmail';

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

        const EmailMessage = `${process.env.BASE_URL}/user/verify/${response._id}/${emailToken}`;

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

        const verified = await User.findOneAndUpdate({ _id: id }, { emailToken: '', isVerified: true });
        delete verified.toObject().password;
        return verified;
    } catch (error) {
        throw error;
    }
};

const login = async (data) => {
    try {
        const { email, password } = data;
        ;
    } catch (error) {
        throw error;
    }
};

export const userService = {
    createNewUser,
    getUser,
    verifyEmail,
    login,
};
