import { Schema, model } from 'mongoose';

const MealSchena = new Schema({
    time: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    }
});

const DietSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    Lunes: [MealSchena],
    Martes: [MealSchena],
    Miércoles: [MealSchena],
    Jueves: [MealSchena],
    Viernes: [MealSchena],
    Sábado: [MealSchena],
    Domingo: [MealSchena]
});

export default model('Diet', DietSchema);

