import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import User from '../models/user.model.js';
import createTransport from '../utils/createTransport.util.js';
import validateEmail from '../utils/validateEmail.util.js';
import validatePassword from '../utils/validatePassword.util.js';

export const register = async (req, res) => {
    try {
        const emailExists = await User.findOne({ email: req.body.email });
        if (emailExists) {
            return res.status(400).json({ message: 'Correo electrónico ya registrado' });
        }

        if (!validateEmail(req.body.email) || !validatePassword(req.body.password)) {
            return res.status(400).json({ message: 'Correo electrónico no válido' });
        }

        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        const confirmToken = Math.floor(100000 + Math.random() * 900000).toString();
        const user = new User({ ...req.body, id: uuidv4(), password: hashedPassword, emailConfirmToken: confirmToken });
        await user.save();

        const transporter = createTransport();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Confirmación de correo electrónico',
            text: `Tu código de confirmación es: ${confirmToken}. Por favor, ingresa este código en la aplicación para confirmar tu correo electrónico.`,
        };

        await transporter.sendMail(mailOptions);

        res.status(201).json({ user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export const confirmEmail = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || user.emailConfirmToken !== req.body.token) {
            return res.status(400).json({ message: 'Token de confirmación inválido' });
        }

        user.isEmailConfirmed = true;
        user.emailConfirmToken = undefined;
        await user.save();

        res.json({ message: 'Correo electrónico confirmado' });
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

        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const transporter = createTransport();
        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Notificación de inicio de sesión',
            text: `Se ha iniciado sesión en tu cuenta desde el dispositivo ${req.headers['user-agent']}. Si no reconoces este inicio de sesión, por favor, informa de ello.`,
        };
        await transporter.sendMail(mailOptions);

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

        const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        await user.save();

        const transporter = createTransport();

        const mailOptions = {
            to: user.email,
            from: process.env.EMAIL_USERNAME,
            subject: 'Restablecimiento de contraseña',
            text: `Has solicitado el restablecimiento de tu contraseña. Tu código de restablecimiento es: ${resetToken}. Por favor, ingresa este código en la aplicación para completar el proceso.\n\nSi no solicitaste esto, por favor ignora este correo y tu contraseña permanecerá sin cambios.`,
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
        const user = await User.findOne({ email: req.body.email });
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

export const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;

        res.json(userWithoutPassword);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};