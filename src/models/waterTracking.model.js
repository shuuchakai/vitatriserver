import { Schema, model } from 'mongoose';

const waterTrackingSchema = new Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    date: {
        type: Date,
        required: true,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
        min: [0, 'La cantidad de agua no puede ser negativa'],
    },
}, { timestamps: true });

const WaterTracking = model('WaterTracking', waterTrackingSchema);

export default WaterTracking;