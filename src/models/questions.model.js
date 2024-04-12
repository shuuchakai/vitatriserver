import { Schema, model } from 'mongoose';

const questionSchema = new Schema({
    user_id: {
        type: String,
        required: true,
        trim: true,
    },
    age: {
        type: Number,
        required: true,
        trim: true,
    },
    weight: {
        type: Number,
        required: true,
        trim: true,
    },
    height: {
        type: Number,
        required: true,
        trim: true,
    },
    biological_sex: {
        type: String,
        required: true,
        trim: true,
    },
    gender: {
        type: String,
        required: true,
        trim: true,
    },
    blood_type: {
        type: String,
        required: true,
        trim: true,
    },
    physical_activity: {
        type: String,
        required: true,
        trim: true,
    },
    schedule: {
        type: Array,
        required: true,
        trim: true,
    },
    preferences: {
        type: Array,
        required: true,
        trim: true,
    },
    allergies: {
        type: Array,
        required: true,
        trim: true,
    },
    diseases: {
        type: Array,
        required: true,
        trim: true,
    },
    medications: {
        type: Array,
        required: true,
        trim: true,
    },
    water_intake_amount: {
        type: String,
        required: true,
    },
    water_intake_unit: {
        type: String,
        required: true,
    },
    sleep_hours: {
        type: Number,
        required: true,
        trim: true,
    },
    goal: {
        type: String,
        required: true
    },
    specific_goal: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Question = model('Question', questionSchema);

export default Question;