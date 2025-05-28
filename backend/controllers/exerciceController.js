import Exercice from '../models/Exercice.js';
import Notification from '../models/Notification.js';
import Teacher from '../models/Teacher.js';      // ← importer le modèle enseignant
import jwt from 'jsonwebtoken';

export const createExercice = async (req, res) => {
  try {
    // Récupérer et décoder le token
    const header = req.header('Authorization');
    if (!header) return res.status(401).json({ msg: 'Aucun token' });
    const token = header.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const teacherId = decoded.id;

    // Valider le payload
    const { title, level, module, category, questions } = req.body;
    if (!title || !level || !module || !category || !questions?.length) {
      return res.status(400).json({ message: 'Tous les champs sont obligatoires.' });
    }

    // Créer l’exercice
    const newExercice = new Exercice({ title, level, module, category, questions, teacher: teacherId });
    const saved = await newExercice.save();

    // Charger l’enseignant pour avoir son prénom/nom
    const teacher = await Teacher.findById(teacherId).select('prenom name');
    const fullName = teacher ? `${teacher.prenom} ${teacher.name}` : 'Un collègue';

    // Notifications
    await Notification.create({
      text: `Exercice ajouté : ${saved.title}`,
      target: 'admin',
      read: false
    });
    
       await Notification.create({
         text:   `Votre collègue ${fullName} a ajouté un exercie intitulé « ${saved.title} »`,
         target: 'teacher',
         sender: teacherId,
         read:   false
       });

    res.status(201).json(saved);
  } catch (error) {
    console.error('❌ Erreur création de l’exercice :', error);
    res.status(500).json({ message: 'Erreur serveur.' });
  }
};

// 👉 récupérer tous les exercices
export const getAllExercices = async (req, res) => {
  try {
    const exercices = await Exercice.find()
      .populate('level')
      .populate('module')
      .populate('category')
      .populate({
        path: 'teacher',
        match: { status: 'validé' }, 
        select: 'name prenom' // ou 'firstName lastName' selon ton modèle
      });
      const exercicesFiltres = exercices.filter(ex => ex.teacher !== null);

      res.json(exercicesFiltres);
  } catch (err) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
};