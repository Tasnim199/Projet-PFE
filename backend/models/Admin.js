import mongoose from 'mongoose';

const AdminSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
}, { timestamps: true });
//timestamps  ajoute les champs createdAt et updatedAt 
export default mongoose.model('Admin', AdminSchema);
