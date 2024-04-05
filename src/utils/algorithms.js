import bcrypt from 'bcrypt';
import mongoose from 'mongoose';
export const hashPassword = async (password) => {
    if (!password) return '';
    return await bcrypt.hash(password, 10);
};

export const validateObjectId = (id) => {
    if (!id) return '';
    return mongoose.Types.ObjectId.isValid(id);
};
