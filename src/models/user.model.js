import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    _id: {
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
    biologicalSex: {
        type: String,
        required: [true, 'Por favor seleccione un sexo biológico'],
        enum: ['Masculino', 'Femenino']
    },
    dateOfBirth: {
        type: Date,
        required: [true, 'Por favor ingrese una fecha de nacimiento'],
        max: [new Date().toISOString(), 'La fecha de nacimiento no puede ser en el futuro']
    },
    height: {
        type: Number,
        required: [true, 'Por favor ingrese una altura'],
        min: [0, 'La altura no puede ser negativa'],
    },
    weight: {
        type: Number,
        required: [true, 'Por favor ingrese un peso'],
        min: [0, 'El peso no puede ser negativo']
    },
    dieteticPreferences: {
        type: String,
        trim: true
    },
    fitnessExperience: {
        type: String,
        enum: ['Principiante', 'Intermedio', 'Avanzado'],
        trim: true
    },
    medicLimitations: {
        type: String,
        trim: true
    },
    bloodType: {
        type: String,
        enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'Desconocido'],
        trim: true
    },
    personalFitnessPreferences: {
        type: String,
        trim: true
    },
    mainGoal: {
        type: String,
        enum: ["Incrementar masa muscular", "Incrementar peso", "Mantener peso", "Perder peso"],
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