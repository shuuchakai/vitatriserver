import { Schema, model } from 'mongoose';

const goalSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'Por favor ingrese un ID de usuario'],
    },
    title: {
        type: String,
        required: [true, 'Por favor ingrese un título'],
        trim: true,
        maxlength: [100, 'El título no puede exceder los 100 caracteres']
    },
    startTime: {
        type: Date,
        required: [true, 'Por favor ingrese un tiempo de inicio'],
    },
    endTime: {
        type: Date,
        required: [true, 'Por favor ingrese un tiempo de finalización'],
    },
    priority: {
        type: String,
        enum: ['Alta', 'Media', 'Baja'],
        required: [true, 'Por favor seleccione una prioridad'],
    },
    progress: {
        type: Number,
        default: 0,
    },
}, { timestamps: true });

const Goal = model('Goal', goalSchema);

export default Goal;