import nodemailer from 'nodemailer';

const createTransport = () => {
    return nodemailer.createTransport({
        service: 'hotmail',
        secure: false,
        host: 'smtp.office365.com',
        port: 587,
        host: 'smtp.office365.com',
        port: 587,
        secure: false, // `false` for port 587, `true` for 465, Office 365 uses STARTTLS on 587
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD,
        },
        tls: {
            // No specific ciphers necessary
            rejectUnauthorized: true
        },
        logger: true
    });
};


export default createTransport;
