import mongoose, { Schema } from 'mongoose';

const userSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            maxLength: [50, 'Name cannot exceed 50 characters'],
            minLength: [2, 'Name should have more than 2 characters'],
        },
        email: {
            type: String,
            required: [true, 'Please, enter your email!'],
            unique: true,
        },
        password: {
            type: String,
            required: [true, 'Please, enter your password!'],
            minLength: [8, 'Password must be at least 8 characters'],
        },
        isAdmin: {
            type: Boolean,
            default: false,
        },
        isBlock: {
            type: Boolean,
            default: false,
        },
        address: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        _destroy: {
            type: Boolean,
            default: false,
        },
        avatar: {
            public_id: String,
            url: String,
        },

        resetPasswordToken: { type: String },
        resetPasswordExpires: { type: Date },
        emailToken: { type: String },
    },
    { timestamps: true },
);

const User = mongoose.model('User', userSchema);

export default User;
