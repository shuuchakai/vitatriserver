import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    id: {
        type: String,
        trim: true,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Por favor ingrese un nombre'],
        trim: true,
        maxlength: [100, 'El nombre no puede exceder los 100 caracteres']
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Por favor ingrese un correo electrónico'],
        trim: true,
        lowercase: true,
    },
    password: {
        type: String,
        required: [true, 'Por favor ingrese una contraseña'],
        trim: true,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres']
    },
    resetPasswordToken: {
        type: String,
        default: null
    },
    resetPasswordExpires: {
        type: Date,
        default: null
    },
    emailConfirmToken: {
        type: String,
        default: null
    },
    isEmailConfirmed: {
        type: Boolean,
        default: false
    },
}, { timestamps: true });

const User = model('User', userSchema);

export default User;