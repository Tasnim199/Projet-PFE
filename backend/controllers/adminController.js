import Admin from '../models/Admin.js'; // modèle Admin pour récupérer l'admin depuis la base
import Teacher from '../models/Teacher.js'; // modèle Teacher pour récupérer et mettre à jour les enseignants
import bcrypt from 'bcryptjs'; // pour hacher et comparer les mots de passe
import jwt from 'jsonwebtoken'; // pour générer les tokens d'authentification

// Connexion de l'admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body; // récupérer l'email et le mdp envoyés par l'admin 
    try {
        // Vérification si l'admin existe dans la BD
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ msg: "Admin introuvable" });

        // Comparaison du mot de passe saisi avec celui enregistré dans la base de données
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Mot de passe incorrect" });

        // Génération du token JWT pour l'authentification de l'admin
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Renvoi du token dans la réponse
        res.json({ token });
    } catch (err) {
        console.error(err);  // Log l'erreur pour le débogage
        res.status(500).json({ msg: "Erreur serveur" });
    }
};

// Récupération de la liste des enseignants
export const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find(); // récupérer tous les enseignants dans la base
        res.json(teachers); // Envoi de la liste en réponse 
    } catch (err) {
        console.error(err);  // Log l'erreur pour le débogage
        res.status(500).json({ msg: "Erreur lors de la récupération des enseignants" });
    }
};

// Mise à jour du statut des enseignants
export const updateTeacherStatus = async (req, res) => {
    try {
        // Recherche et mise à jour du statut de l'enseignant
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        
        if (!teacher) {
            return res.status(404).json({ msg: "Enseignant non trouvé" });  // Si l'enseignant n'est pas trouvé
        }

        res.json(teacher);  // Renvoi de l'enseignant mis à jour
    } catch (err) {
        console.error(err);  // Log l'erreur pour le débogage
        res.status(500).json({ msg: "Erreur lors de la mise à jour du statut de l'enseignant" });
    }
};

// Endpoint pour récupérer les données de l'admin dashboard
export const getAdminDashboard = async (req, res) => {
    try {
        // Exemple de données à envoyer
        const adminData = {
            someInfo: "Voici des informations de l'admin",
            adminId: req.adminId, // Ajoute l'adminId pour s'assurer qu'on reçoit bien le token
      
        };

        res.json(adminData);
    } catch (err) {
        res.status(500).json({ msg: "Erreur serveur" });
    }
};
