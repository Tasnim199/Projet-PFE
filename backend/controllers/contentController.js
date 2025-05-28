import Content from '../models/Content.js';

const modifierDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, levelId, moduleId, categoryId} = req.body;
    const file = req.file;

    if (!title || !levelId || !moduleId || !categoryId) {
      return res.status(400).json({ message: 'Tous les champs sont requis' });
    }

    const updateData = { title, levelId, moduleId, categoryId };
    if (file) {
      updateData.file = file.path;
    }

    const updatedDocument = await Content.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedDocument) {
      return res.status(404).json({ message: "Contenu non trouvé" });
    }

    res.status(200).json({ message: "Document mis à jour", document: updatedDocument });
  } catch (error) {
    console.error("Erreur lors de la mise à jour du document:", error);
    res.status(500).json({ message: "Erreur serveur", error: error.message });
  }
};

export { modifierDocument };
