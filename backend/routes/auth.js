import express from 'express';
import crypto from 'crypto';
import jwt    from 'jsonwebtoken';
import Student from '../models/Student.js';
import Teacher from '../models/Teacher.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'CHANGE_ME';

// 2.1. Forgot Password
router.post('/forgot-password', async (req, res) => {
  const { email, role } = req.body;  
  // role doit valoir 'student' ou 'teacher'
  const Model = role === 'teacher' ? Teacher : Student;

  const user = await Model.findOne({ email });
  if (user) {
    const token = crypto.randomBytes(32).toString('hex');
    user.resetToken    = token;
    user.resetTokenExp = Date.now() + 1000 * 60 * 30; // 30 minutes
    await user.save();

    // Construire le lien (adapter ton domaine)
    const resetLink = `${process.env.FRONT_URL}/reset-password?token=${token}&role=${role}`;
    console.log(`Envoyer lien reset à ${email}: ${resetLink}`);
    // TODO: envoi email via nodemailer ou service tiers...
  }
  // Toujours renvoyer 200 pour éviter la reconnaissance d'utilisateurs existants
  res.json({ message: 'Si cet email existe, un lien a été envoyé.' });
});

// 2.2. Reset Password
router.post('/reset-password', async (req, res) => {
  const { token, password, role } = req.body;
  const Model = role === 'teacher' ? Teacher : Student;

  const user = await Model.findOne({
    resetToken: token,
    resetTokenExp: { $gt: Date.now() }
  });
  if (!user) {
    return res.status(400).json({ message: 'Token invalide ou expiré.' });
  }

  user.password      = password;
  user.resetToken    = undefined;
  user.resetTokenExp = undefined;
  await user.save();

  res.json({ message: 'Mot de passe réinitialisé.' });
});

export default router;
