// src/models/Teacher.js
import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';


const TeacherSchema = new mongoose.Schema({
  name: { type: String, required: true },              // Nom
  prenom: { type: String, required: true },            // Prénom
  email: { type: String, required: true, unique: true },
  schoolName: { type: String, required: true },        // Nom de l'école
  city: { type: String, required: true },              // Ville
  phone: { type: String,  required : true},
  password: { type: String, required: true },          // Mot de passe
  status: { type: String, enum: ['validé', 'bloqué'], default: 'validé' },
  resetToken:      String,   // ← ajouté
  resetTokenExp:   Date      // ← ajouté
}, { timestamps: true });
// Avant de sauvegarder l'enseignant, on hache le mot de passe
TeacherSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Méthode pour comparer le mot de passe lors de la connexion
TeacherSchema.methods.comparePassword = function(password) {
  return bcrypt.compare(password, this.password);
};
export default mongoose.model('Teacher', TeacherSchema);

