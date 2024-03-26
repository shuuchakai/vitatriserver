import { Schema, model } from 'mongoose';

const actionSchema = new Schema({
    userId: {
        type: String,
        required: [true, 'Por favor ingrese un ID de usuario'],
    },
    goalId: {
        type: String,
        required: [true, 'Por favor ingrese un ID de objetivo'],
    },
    action: {
        type: String,
        enum: ['Bajar', 'Incrementar', 'Mantener', 'Consumir'],
        required: [true, 'Por favor seleccione una acción'],
    },
    quantity: {
        type: Number,
        required: [true, 'Por favor ingrese una cantidad'],
    },
    unit: {
        type: String,
        required: [true, 'Por favor ingrese una unidad'],
    },
}, { timestamps: true });

const Action = model('Action', actionSchema);

export default Action;