import { Schema, model } from 'mongoose';

const IngredientsSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    quantity: {
        type: Number,
        required: true,
        min: 0
    },
    calories: {
        type: Number,
        required: true,
        min: 0
    },
    carbs: {
        type: Number,
        required: true,
        min: 0
    },
    proteins: {
        type: Number,
        required: true,
        min: 0
    },
    fats: {
        type: Number,
        required: true,
        min: 0
    }
});

const MealSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 50
    },
    preparation: {
        type: String,
        required: true
    },
    ingredients: [IngredientsSchema],
    nutritionalContent: {
        calories: {
            type: Number,
            required: true,
            min: 0
        },
        carbs: {
            type: Number,
            required: true,
            min: 0
        },
        proteins: {
            type: Number,
            required: true,
            min: 0
        },
        fats: {
            type: Number,
            required: true,
            min: 0
        }
    }
});

const DaySchema = new Schema({
    monday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    },
    tuesday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    },
    wednesday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    },
    thursday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    },
    friday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    },
    saturday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    },
    sunday: {
        breakfast: MealSchema,
        lunch: MealSchema,
        dinner: MealSchema
    }
});

const nutritionalPlanSchema = new Schema({
    id: {
        type: Schema.Types.ObjectId,
        trim: true,
        auto: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },
    recipes: DaySchema,
});

const NutritionalPlan = model('NutritionalPlan', nutritionalPlanSchema);

export default NutritionalPlan;