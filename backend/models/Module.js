import mongoose from 'mongoose';

const moduleSchema = new mongoose.Schema({
    level: { type: String, required: true },  // "Niveau" -> "level"
    number: { type: Number, required: true }, // "Numéro" -> "number"
    name: { type: String, required: true }    // "Libellé" -> "name"
});

export default mongoose.model('Module', moduleSchema);
