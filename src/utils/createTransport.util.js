import nodemailer from 'nodemailer';

const createTransport = () => {
    return nodemailer.createTransport({
        service: 'hotmail',
        secure: false,
        host: 'smtp.office365.com',
        port: 587,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
};

export default createTransport;