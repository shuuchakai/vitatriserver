import nodemailer from 'nodemailer';

const createTransport = () => {
    return nodemailer.createTransport({
        service: 'hotmail',
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

export default createTransport;