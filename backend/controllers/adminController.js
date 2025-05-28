import Admin from '../models/Admin.js';
import Teacher from '../models/Teacher.js';
import Module from '../models/Module.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import Content from  '../models/Content.js';
import Exercice from  '../models/Exercice.js';
import Homework from  '../models/Homework.js';
import Student from  '../models/Student.js';
import authMiddleware from '../middleware/authMiddleware.js';

// Connexion de l'admin
export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ msg: "Admin introuvable" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) return res.status(400).json({ msg: "Mot de passe incorrect" });

    const token = jwt.sign(
      { id: admin._id, role: 'admin' },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    )
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

export const getTeachers = async (req, res) => {
  try {
    const teachers = await Teacher.find();
    res.json(teachers);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de la récupération des enseignants" });
  }
};

export const updateTeacherStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['validé', 'bloqué'].includes(status)) {
      return res.status(400).json({ msg: "Statut invalide" });
    }
    const teacher = await Teacher.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!teacher) {
      return res.status(404).json({ msg: "Enseignant non trouvé" });
    }
    res.json(teacher);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de la mise à jour du statut" });
  }
};

export const getAdminDashboard = async (req, res) => {
  try {
    const teacherCount = await Teacher.countDocuments({ status: 'validé' }); // ou autre critère
    const userCount = await Student.countDocuments(); // parents + élèves
    const documentCount = await Content.countDocuments();
    const exerciseCount = await Exercice.countDocuments();
    const homeworkCount = await Homework.countDocuments();
    const visitCount = 0;

    res.status(200).json({
      teacherCount,
      userCount,
      documentCount,
      exerciseCount,
      homeworkCount,
      visitCount,
      
    });
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur', error: err.message });
  }
};

export const addModule = async (req, res) => {
  const { name, level } = req.body;
  try {
    const existingModule = await Module.findOne({ name, level });
    if (existingModule) {
      return res.status(400).json({ msg: "Ce module existe déjà" });
    }
    const newModule = new Module({ name, level });
    await newModule.save();
    res.status(201).json({ msg: "Module ajouté avec succès", module: newModule });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de l'ajout du module" });
  }
};

export const getModules = async (req, res) => {
  try {
    const modules = await Module.find();
    res.json(modules);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur lors de la récupération des modules" });
  }
};

export const getAdminProfile = async (req, res) => {
    try {
      const admin = await Admin.findById(req.adminId).select('-password'); // On ne renvoie pas le mot de passe
      if (!admin) {
        return res.status(404).json({ msg: 'Admin non trouvé' });
      }
      res.json(admin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Erreur du serveur' });
    }
  };
  
  // Mettre à jour le profil de l'admin
  export const updateAdminProfile = async (req, res) => {
    const { name, email } = req.body;
  
    try {
      const admin = await Admin.findByIdAndUpdate(
        req.adminId,
        { name, email },
        { new: true, runValidators: true }
      );
  
      if (!admin) {
        return res.status(404).json({ msg: 'Admin non trouvé' });
      }
  
      res.json(admin);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: 'Erreur du serveur' });
    }
  };

