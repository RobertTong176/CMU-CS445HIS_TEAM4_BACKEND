import mongoose, { Schema } from 'mongoose';

const roleSchema = new Schema(
    {
        title: {
            type: String,
            unique: true,
            required: true,
        },
    },
    { timestamps: true },
);

const Role = mongoose.model('Role', roleSchema);

export default Role;
