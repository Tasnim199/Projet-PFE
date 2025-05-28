import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';

import Teacher from '../models/Teacher.js';
import Content from '../models/Content.js';
import Exercice from '../models/Exercice.js';
import Notification from '../models/Notification.js';       // ← IMPORT du modèle Notification
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

// --- STATISTIQUES (inchangé) ---
router.get('/stats', verifyToken, async (req, res) => {
  const teacherId = req.teacherId;
  try {
    const teacherObjectId = new mongoose.Types.ObjectId(teacherId);
    const documentsCount = await Content.countDocuments({ teacherId: teacherObjectId });
    const questionsCount = await Exercice.countDocuments({ teacher: teacherObjectId });

    const [docStats] = await Content.aggregate([
      { $match: { teacherId: teacherObjectId } },
      { $group: { _id: null, totalConsultations: { $sum: '$consultations' } } }
    ]);

    const [exStats] = await Exercice.aggregate([
      { $match: { teacher: teacherObjectId } },
      { $group: { _id: null, totalConsultations: { $sum: '$consultations' } } }
    ]);

    const consultationsCount = (docStats?.totalConsultations || 0) + (exStats?.totalConsultations || 0);

    console.log('📊 Stats MAJ :', { documentsCount, questionsCount, consultationsCount });
    res.json({ documentsCount, questionsCount, consultationsCount });
  } catch (err) {
    console.error('❌ Erreur stats :', err);
    res.status(500).json({ msg: 'Erreur serveur' });
  }
});

// --- INSCRIPTION ENSEIGNANT ---
router.post('/register', async (req, res) => {
  console.log('Requête reçue pour register avec body :', req.body);
  try {
    const { name, prenom, email, schoolName, phone, city, password } = req.body;

    // Vérification doublon e-mail
    const existingTeacher = await Teacher.findOne({ email });
    if (existingTeacher) {
      return res.status(400).json({ message: 'Cet email est déjà utilisé.' });
    }

    // Hash du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Création du teacher
    const newTeacher = new Teacher({
      name,
      prenom,
      email,
      schoolName,
      phone,
      city,
      password: hashedPassword,
      status: 'validé',
    });
    await newTeacher.save();

    // --- NOUVELLE NOTIFICATION POUR L'ADMIN ---
    await Notification.create({
      text: `Nouvel enseignant inscrit : ${prenom} ${name}`,
      target: 'admin',
      read: false
    });

    // Génération du token
    const token = jwt.sign(
      { id: newTeacher._id, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Envoi de la réponse
    res.status(201).json({
      token,
      teacherId: newTeacher._id,
      message: 'Compte créé et connecté avec succès !'
    });
  } catch (error) {
    console.error("Erreur lors de l'inscription :", error);
    res.status(500).json({ message: "Erreur lors de l'inscription", error });
  }
});

// --- CONNEXION ENSEIGNANT (inchangé) ---
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const teacher = await Teacher.findOne({ email });
    if (!teacher) {
      return res.status(400).json({ message: 'Utilisateur non trouvé' });
    }

    const isMatch = await bcrypt.compare(password, teacher.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Mot de passe incorrect' });
    }
    if (teacher.status === 'bloqué') {
      return res.status(400).json({ message: 'Compte bloqué' });
    }

    const token = jwt.sign(
      { id: teacher._id, role: 'teacher' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ token, teacherId: teacher._id, message: 'Connexion réussie' });
  } catch (error) {
    console.error('Erreur lors de la connexion :', error);
    res.status(500).json({ message: 'Erreur lors de la connexion', error });
  }
});

// --- RÉCUPÉRER UN ENSEIGNANT ---
router.get('/:id', async (req, res) => {
  try {
    const teacher = await Teacher.findById(req.params.id).select('-password');
    if (!teacher) return res.status(404).json({ message: 'Enseignant non trouvé' });
    res.json(teacher);
  } catch (error) {
    console.error('Erreur serveur :', error);
    res.status(500).json({ message: 'Erreur serveur' });
  }
});

// --- MODIFIER UN ENSEIGNANT ---
router.put('/modifier/:id', async (req, res) => {
  console.log('Données reçues pour modification :', req.body);
  try {
    const { name, prenom, email, schoolName, city, password, newPassword } = req.body;
    const teacher = await Teacher.findById(req.params.id);
    if (!teacher) return res.status(404).json({ message: 'Enseignant non trouvé' });

    // Mise à jour du mot de passe si demandé
    if (newPassword) {
      const isMatch = await bcrypt.compare(password, teacher.password);
      if (!isMatch) return res.status(400).json({ message: 'Mot de passe actuel incorrect.' });
      const salt = await bcrypt.genSalt(10);
      teacher.password = await bcrypt.hash(newPassword, salt);
    }

    // Mise à jour des autres champs
    teacher.name = name || teacher.name;
    teacher.prenom = prenom || teacher.prenom;
    teacher.email = email || teacher.email;
    teacher.schoolName = schoolName || teacher.schoolName;
    teacher.city = city || teacher.city;

    await teacher.save();
    const { password: _, ...updatedTeacher } = teacher.toObject();
    res.json(updatedTeacher);
  } catch (error) {
    console.error('Erreur lors de la mise à jour :', error);
    res.status(500).json({ message: 'Erreur serveur lors de la mise à jour.' });
  }
});

export default router;



