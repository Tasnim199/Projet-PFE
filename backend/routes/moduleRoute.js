import express from 'express';
import Module from '../models/Module.js';  // Importer le modèle de Module
const router = express.Router();
router.use(express.json());
// Route pour ajouter un module

router.post('/modules', async (req, res) => {
    try {
        const { level, number, name } = req.body; // Assurez-vous que les noms correspondent au schéma

        const newModule = new Module({ level, number, name });

        await newModule.save();
        res.status(201).json(newModule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de l'ajout du module" });
    }
})
// Route pour récupérer tous les modules
router.get('/modules', async (req, res) => {
    try {
        const modules = await Module.find();  // Récupérer tous les modules
        res.status(200).json(modules);        // Répondre avec la liste des modules
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la récupération des modules' });
    }
});
// Exemple dans module.routes.js
router.get('/modules/level/:levelName', async (req, res) => {
    try {
      const modules = await Module.find({ level: req.params.levelName });
      res.json(modules);
    } catch (err) {
      res.status(500).json({ message: 'erreur' });
    }
  });
  
// Route pour modifier un module
router.put('/modules/:id', async (req, res) => {
    try {
        const { name, number, level } = req.body;

        // Mettre à jour le module avec l'ID spécifié
        const updatedModule = await Module.findByIdAndUpdate(
            req.params.id,
            { name, number, level },
            { new: true }  // Renvoyer le module mis à jour
        );

        res.status(200).json(updatedModule);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la modification du module' });
    }
});
// Route pour supprimer un module
router.delete('/modules/:id', async (req, res) => {
    try {
        await Module.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Module supprimé avec succès' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Erreur lors de la suppression du module' });
    }
});



export default router;
