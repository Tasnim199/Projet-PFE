import express from 'express';
import Level from '../models/Level.js';

const router = express.Router();

// Fonction pour normaliser le nom des niveaux
const normalizeLevelName = (name) => {
    name = name.toLowerCase(); // Tout en minuscule
    name = name.replace('quatrième', '4').replace('4ème', '4')
               .replace('cinquième', '5').replace('5ème', '5')
               .replace('sixième', '6').replace('6ème', '6');
    
    name = name.normalize('NFD').replace(/[\u0300-\u036f]/g, "");
    return name.trim(); // Supprimer les espaces supplémentaires
};

// Route pour récupérer tous les niveaux
router.get('/', async (req, res) => {
    try {
        const levels = await Level.find();
        res.json(levels);  // Retourne la liste des niveaux
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Ajouter un niveau
router.post('/add', async (req, res) => {
    try {
        const { name, description } = req.body;

        // Normaliser le nom avant de le comparer
        const normalizedName = normalizeLevelName(name);

        // Vérifier si le niveau existe déjà en cherchant par le nom normalisé
        const existingLevel = await Level.findOne({ name: normalizedName });

        if (existingLevel) {
            return res.status(400).json({ message: 'Ce niveau existe déjà.' });
        }

        // Ajouter le niveau à la base de données si aucun doublon trouvé
        const level = new Level({ name, description });
        await level.save();
        res.status(201).json(level);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Modifier un niveau
router.put('/edit/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const level = await Level.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        res.json(level);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un niveau
router.delete('/delete/:id', async (req, res) => {
    try {
        const level = await Level.findByIdAndDelete(req.params.id);
        res.json({ message: 'Niveau supprimé', level });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;


