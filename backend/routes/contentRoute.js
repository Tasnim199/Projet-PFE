import express from 'express';
import Content from '../models/Content.js';
import upload from '../config/multer.js';
import mongoose from 'mongoose';
import { modifierDocument } from '../controllers/contentController.js';
import verifyToken from '../middleware/verifyToken.js';
import authMiddleware from '../middleware/authMiddleware.js';
import Notification from '../models/Notification.js';
import Teacher from '../models/Teacher.js'; 
const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const contents = await Content.find()
      .populate('categoryId')
      .populate('moduleId')
      .populate('levelId')
      .populate({
        path: 'teacherId',
        match: { status: 'validé' }, // 👈 Ne récupère que les enseignants activés
      });

    // Filtrer les contenus dont teacherId est null (enseignants bloqués)
    const filteredContents = contents.filter(content => content.teacherId !== null);

    res.status(200).json(filteredContents);
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Ajouter un document
router.post('/ajouter-document', upload.single('document'), async (req, res) => {
  try {
    console.log('Fichier reçu:', req.file);
    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier reçu' });
    }
    // Log le contenu du body
    console.log('Données reçues dans req.body:', req.body);
    const { title, categoryId, moduleId, levelId, teacherId } = req.body;

    if (!title || !categoryId || !moduleId || !levelId || !teacherId) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    // Créer un nouveau document avec les données reçues et le chemin du fichier téléchargé
    const newDocument = new Content({
      title,
      file: req.file.path,  // Utiliser le chemin du fichier téléchargé
      categoryId,
      moduleId,
      levelId,
      teacherId,
      status: 'approved',  // Statut par défaut
    });

    // Sauvegarder le document dans la base de données
    await newDocument.save();
 
    await Notification.create({
      text: `Document ajouté : ${newDocument.title}`,
      target: 'admin',
      read: false
    });
    const teacher = await Teacher.findById(teacherId).select('prenom name');
    const fullName = `${teacher.prenom} ${teacher.name}`;
    await Notification.create({
      text:   `Votre collègue ${fullName} a ajouté un document « ${newDocument.title} »`,
      target: 'teacher',
      sender: teacherId,
      read:   false
    });
     // Notification pour les élèves de CE NIVEAU
 
     if (mongoose.Types.ObjectId.isValid(levelId)) {
      await Notification.create({
        text: `Nouveau document intitulé « ${newDocument.title} » ajouté par ${fullName}`,
        target: 'student',
        sender: teacherId,
        level: new mongoose.Types.ObjectId(levelId), // ✅ Conversion explicite
      
      });
    }
    res.status(200).json({ message: 'Document ajouté avec succès', document: newDocument });
  } catch (error) {
    console.error('Erreur lors de l\'ajout du document:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});

// Modifier le statut d’un contenu (ex: approuver, bloquer, etc.)
router.put('/status/:id', async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'pending', 'rejected', 'bloqué'].includes(status)) {
      return res.status(400).json({ message: 'Statut invalide' });
    }

    const updatedContent = await Content.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!updatedContent) {
      return res.status(404).json({ message: 'Contenu non trouvé' });
    }

    res.json({ message: 'Statut mis à jour', content: updatedContent });
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
router.get('/enseignant/:teacherId', async (req, res) => {
  const { teacherId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(teacherId)) {
    return res.status(400).json({ message: "ID de l'enseignant invalide." });
  }

  try {
    const documents = await Content.find({ teacherId })
      .populate('categoryId', 'name')
      .populate('moduleId', 'name')
      .populate('levelId', 'name');

    if (!documents.length) {
      return res.status(404).json({ message: "Aucun document trouvé." });
    }

    res.status(200).json(documents);
  } catch (error) {
    console.error("Erreur lors de la récupération des contenus :", error);
    res.status(500).json({ message: "Erreur serveur." });
  }
});
// Route : DELETE /contents/supprimer-document/:docId
router.delete('/supprimer-document/:docId', async (req, res) => {
  const { docId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(docId)) {
    return res.status(400).json({ message: "ID du contenu invalide." });
  }

  try {
    const deleted = await Content.findByIdAndDelete(docId);
    
    if (!deleted) {
      return res.status(404).json({ message: "Contenu non trouvé." });
    }

    res.status(200).json({ message: "Contenu supprimé avec succès." });
  } catch (error) {
    console.error("Erreur suppression :", error);
    res.status(500).json({ message: "Erreur serveur lors de la suppression." });
  }
});
router.put('/modifier-document/:id', upload.single('file'), modifierDocument);
router.get('/tous-les-documents', async (req, res) => {
  try {
    const contents = await Content.find()
      .populate('categoryId')
      .populate('moduleId')
      .populate('levelId')
      .populate({
        path: 'teacherId',
        match: { status: 'validé' }, // 👈 On récupère seulement les enseignants actifs
      });

    // 🔍 Filtrage des documents des enseignants bloqués
    const filteredContents = contents.filter(content => content.teacherId !== null);

    res.status(200).json(filteredContents);
  } catch (error) {
    console.error('Erreur lors de la récupération des contenus:', error);
    res.status(500).json({ message: 'Erreur serveur', error: error.message });
  }
});
// Nouvelle route pour consulter UN document
// Nouvelle route GET pour un document spécifique
// Route spécifique pour les consultations admin
router.get('/admin/:id', authMiddleware, async (req, res) => {
  try {
    const doc = await Content.findById(req.params.id);
    
    if (!doc) return res.status(404).json({ message: "Document introuvable" });
    
    doc.consultations += 1;
    await doc.save();
    console.log("Consultation ADMIN comptabilisée !");

    res.json(doc);
  } catch (error) {
    res.status(500).json({ message: 'Erreur serveur' });
  }
});
// ➕ AJOUTER CETTE ROUTE MANQUANTE
router.get('/:id', verifyToken, async (req, res) => {
  try {
    const doc = await Content.findById(req.params.id)
      .populate('teacherId');

    if (!doc) return res.status(404).json({ message: "Document introuvable" });

    // On ne comptabilise la consultation que si l'enseignant consulte un doc qui n'est pas à lui
    if (doc.teacherId._id.toString() !== req.teacherId) {
      doc.consultations += 1;
      await doc.save();
      console.log("Consultation enseignant comptabilisée !");
    }

    res.json(doc);
  } catch (error) {
    console.error("ERREUR DOCUMENT:", error);
    res.status(500).json({ message: 'Erreur serveur' });
  }});
export default router;
