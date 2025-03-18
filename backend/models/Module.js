import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
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
export default mongoose.model('Module', moduleSchema);
