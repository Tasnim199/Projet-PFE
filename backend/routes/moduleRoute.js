import express from 'express';
import Module from '../models/Module.js';

const router = express.Router();

// Ajouter un module
router.post('/add', async (req, res) => {
    try {
        const { name, description } = req.body;
        const module = new Module({ name, description });
        await module.save();
        res.status(201).json(module);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Modifier un module
router.put('/edit/:id', async (req, res) => {
    try {
        const { name, description } = req.body;
        const module = await Module.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true }
        );
        res.json(module);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Supprimer un module
router.delete('/delete/:id', async (req, res) => {
    try {
        const module = await Module.findByIdAndDelete(req.params.id);
        res.json({ message: 'Module deleted', module });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
