import express from 'express';
import Content from '../models/Content.js';
import upload from '../config/multer.js';

const router = express.Router();

// Ajouter un contenu avec un fichier (PPT, PDF, Vidéo)
router.post('/add', upload.single('file'), async (req, res) => {
    try {
        const content = new Content({
            title: req.body.title,
            file: req.file.filename,  // Enregistrer le nom du fichier
            teacherId: req.body.teacherId,
        });
        await content.save();  // Sauvegarder dans la base de données
        res.status(201).json(content);  // Retourner le contenu créé
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});
router.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) {
        return res.status(400).send('Aucun fichier téléchargé.');
    }
    res.send('Fichier téléchargé avec succès!');
});
// Mettre à jour le statut du contenu
router.put('/status/:id', async (req, res) => {
    try {
        const { status } = req.body;  // 'approved' ou 'rejected'
        const content = await Content.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(content);  // Retourner le contenu avec son nouveau statut
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
