import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    created_at: {
        type: Date,
        default: Date.now,
    },
});

const Level = mongoose.model('Level', levelSchema);

export default Level;
