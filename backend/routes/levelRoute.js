import express from 'express';
import Level from '../models/Level.js';

const router = express.Router();

// Ajouter un niveau
router.post('/add', async (req, res) => {
    try {
        const { name, description } = req.body;
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
        res.json({ message: 'Level deleted', level });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
