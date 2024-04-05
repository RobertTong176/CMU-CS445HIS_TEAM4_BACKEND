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
