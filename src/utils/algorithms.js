import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

export const hashPassword = async (password) => {
    if (!password) return '';
    return await bcrypt.hash(password, 10);
};

export const validateObjectId = (id) => {
    if (!id) return '';
    return mongoose.Types.ObjectId.isValid(id);
};

export const isTokenExpired = (token) => {
    if (!token) return true;
    const decodedToken = jwt.decode(token, { complete: true });
    if (!decodedToken || !decodedToken.payload) {
        return true;
    }
    const currentTimestamp = Math.floor(Date.now() / 1000);
    return decodedToken.payload.exp < currentTimestamp;
};

export const generateAccessToken = (payload) => {
    try {
        const accessToken = jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: process.env.ACCESS_TOKEN_EXPIRY,
        });
        return accessToken;
    } catch (error) {
        throw error;
    }
};

export const generateRefreshToken = (payload) => {
    try {
        const refreshToken = jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
        });
        return refreshToken;
    } catch (error) {
        throw error;
    }
};
