import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import ApiError from '~/middlewares/ApiError';

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
export const refreshNewToken = async (token) => {
    try {
        // Verify the refresh token
        const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        // Generate a new access token using the decoded user information
        const newAccessToken = generateAccessToken({
            id: decoded.id,
            isAdmin: decoded.isAdmin,
        });

        return newAccessToken;
    } catch (error) {
        if (error.name === 'TokenExpiredError') {
            // If the refresh token has expired, throw an error
            throw new ApiError(403, 'Refresh token expired');
        } else {
            // For other verification errors, throw a generic error
            throw new ApiError(403, 'Failed to verify refresh token');
        }
    }
};

export const mergedArray = (array1 = [], array2 = []) => {
    let result = [];
    array1.forEach((item1) => {
        let matchingData = array2.find((item2) => {
            return item2.idEmployee === item1.PERSONAL_ID;
        });
        if (matchingData) {
            result.push({ ...item1, ...matchingData });
        }
    });

    return result;
};

export const countFields = (arr) => {
    const departmentCounts = {};

    arr.forEach((employee) => {
        const department = employee.DEPARTMENT;
        if (departmentCounts.hasOwnProperty(department)) {
            departmentCounts[department]++;
        } else {
            departmentCounts[department] = 1;
        }
    });

    const result = [];
    for (const department in departmentCounts) {
        result.push({ value: departmentCounts[department], label: department });
    }

    return result;
};
