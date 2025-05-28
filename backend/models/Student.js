import mongoose from 'mongoose';

const studentSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Level', // ← référence au  modèle Level
    required: true
  },
  schoolName: {
    type: String,
    required: true,
    trim: true
  },
  city: {
    type: String,
    required: true,
    trim: true
  },
  parentEmail: {
    type: String,
    required: true,
    unique:true,
    trim: true,
    lowercase: true,
    match: [/^\S+@\S+\.\S+$/, 'Adresse email invalide.']
  },
  password: {
    type: String,
    required: true
  },
   resetToken:      String,      // ← ajouté
  resetTokenExp:   Date,        // ← ajouté
  registeredAt: {
    type: Date,
    default: Date.now
  }
});
// Hash du mdp
studentSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});
const Student = mongoose.model('Student', studentSchema);
export default Student;
