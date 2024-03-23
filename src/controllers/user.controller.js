import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import nodemailer from 'nodemailer';

import User from '../models/user.model.js';

export const register = async (req, res) => {
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const confirmToken = crypto.randomBytes(20).toString('hex');
        const user = new User({ ...req.body, _id: uuidv4(), password: hashedPassword, emailConfirmToken: confirmToken });
        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Confirmación de correo electrónico',
            text: `Por favor, confirma tu correo electrónico haciendo clic en el siguiente enlace, o pegándolo en tu navegador:\n\nhttp://${req.headers.host}/confirm/${confirmToken}`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const confirmEmail = async (req, res) => {
    try {
        const user = await User.findOne({ emailConfirmToken: req.params.token });
        if (!user) {
            return res.status(400).json({ message: 'Token de confirmación de correo electrónico no válido' });
        }

        user.isEmailConfirmed = true;
        user.emailConfirmToken = null;

        await user.save();

        res.json({ message: 'Correo electrónico confirmado con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }
        const validPassword = await bcrypt.compare(req.body.password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña incorrecta' });
        }

        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, user });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            auth: {
                user: process.env.EMAIL_USERNAME,
                pass: process.env.EMAIL_PASSWORD,
            },
        });

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Restablecimiento de contraseña',
            text: `Has solicitado el restablecimiento de tu contraseña. Por favor, haz clic en el siguiente enlace, o pega esto en tu navegador para completar el proceso:\n\nhttp://${req.headers.host}/reset/${resetToken}\n\nSi no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Correo de restablecimiento de contraseña enviado' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const user = await User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } });
        if (!user) {
            return res.status(400).json({ message: 'Token de restablecimiento de contraseña no válido o expirado' });
        }

        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = null;
        user.resetPasswordExpires = null;

        await user.save();

        res.json({ message: 'Contraseña restablecida con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const validPassword = await bcrypt.compare(req.body.currentPassword, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Contraseña actual incorrecta' });
        }

        user.password = await bcrypt.hash(req.body.newPassword, 10);

        await user.save();

        res.json({ message: 'Contraseña actualizada con éxito' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};