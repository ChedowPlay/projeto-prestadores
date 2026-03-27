// 250210V


import { env } from '../services/env';
import nodemailer from 'nodemailer';


export const emailConfig = nodemailer.createTransport({
    host: env.EMAIL_SMTP_HOST,
    port: env.EMAIL_SMTP_PORT,
    secure: false,
    service: env.EMAIL_SERVICE,
    auth: {
        user: env.EMAIL_USER,
        pass: env.EMAIL_PASS,
    },
    tls: {
        ciphers: 'SSLv3',
    }
});
