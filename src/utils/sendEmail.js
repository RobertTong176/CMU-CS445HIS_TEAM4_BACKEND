import nodemailer from 'nodemailer';
const configOptions = {
    service: 'gmail',
    secure: true,
    auth: {
        user: process.env.SM_EMAIL_USER,
        pass: process.env.SM_EMAIL_PASSWORD,
    },
};
export const sendEmail = async (email, subject, text) => {
    try {
        const tranSporter = nodemailer.createTransport(configOptions);
        await tranSporter.sendMail({
            from: process.env.SM_EMAIL_USER,
            to: email,
            subject: subject,
            text: text,
        });
    } catch (error) {
        throw error;
    }
};
