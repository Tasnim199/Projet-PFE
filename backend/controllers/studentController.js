// controllers/studentController.js
import Student from '../models/Student.js';
import Content from '../models/Content.js';
import Notification from '../models/Notification.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const registerStudent = async (req, res) => {
  const { firstName, lastName, level, schoolName, city, parentEmail, password } = req.body;

  try {
    console.log("➡️ registerStudent reçu :", req.body);
    const existingStudent = await Student.findOne({ parentEmail });
    if (existingStudent) return res.status(400).json({ msg: "Email déjà utilisé" });

    const hashedPassword = await bcrypt.hash(password, 10);
    const student = new Student({
      firstName,
      lastName,
      level,
      schoolName,
      city,
      parentEmail,
      password: hashedPassword
    });

    await student.save();
    await Notification.create({
      text: `Nouvel élève inscrit : ${firstName} ${lastName}`,
      target: 'admin',
      read: false
    });
    res.status(201).json({ msg: "Étudiant inscrit avec succès" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};

// controllers/studentController.js

export const loginStudent = async (req, res) => {
  const { parentEmail, password } = req.body;
  try {
    const student = await Student.findOne({ parentEmail });
    if (!student) {
      return res.status(404).json({ msg: "Étudiant non trouvé" });
    }

    console.log("🆚 Données comparison → plain:", password, "hash:", student.password);
    const isMatch = await bcrypt.compare(password, student.password);
    console.log("🔐 bcrypt.compare returned:", isMatch);

    if (!isMatch) {
      return res.status(400).json({ msg: "Mot de passe incorrect" });
    }

    const token = jwt.sign({ id: student._id }, process.env.JWT_SECRET, { expiresIn: "30d" });
    return res.json({ token, student });
  } catch (err) {
    console.error("loginStudent error:", err);
    return res.status(500).json({ msg: "Erreur serveur" });
  }
};

export const getStudentProfile = (req, res) => {
  res.json(req.student);
};
export const getStudentDocuments = async (req, res) => {
  try {
    // À adapter selon ton modèle et logique
    const levelId = req.student.level?._id;

    // Imaginons que les documents sont liés au niveau de l'élève
    const documents = await Content.find({ level: levelId });

    res.json(documents);
  } catch (err) {
    console.error("Erreur documents :", err);
    res.status(500).json({ msg: "Erreur serveur" });
  }
};
