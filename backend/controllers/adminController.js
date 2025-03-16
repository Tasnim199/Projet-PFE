import Admin from '../models/Admin.js'; //modèle Admin pour récupérer l'admin depuis la base
import Teacher from '../models/Teacher.js'; // modèle Teacher pour récupérer et mettre à jour les enseignants 
import bcrypt from 'bcryptjs';//pour hacher et comparer les mots de passe
import jwt from 'jsonwebtoken';// pour générer les tokens d'authentification 

// Connexion de l'admin
export const loginAdmin = async (req, res) => {
    const { email, password } = req.body; //récupérer l'email et le mdp envoyés par l'admin 
    try {
        // vérification si l'admin existe dans la BD
        const admin = await Admin.findOne({ email });
        if (!admin) return res.status(404).json({ msg: "Admin introuvable" });
// Comparaison du mot de passe saisi avec celui enregistré dans la base de données
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) return res.status(400).json({ msg: "Mot de passe incorrect " });
// Generation du token JWT pour l'authentification de l'admin
        const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
        res.json({ token });//envoi du token en réponse
    } catch (err) {
        res.status(500).json({ msg: "Server error" });
    }
};

// Récupération de la liste des enseignants 
export const getTeachers = async (req, res) => {
    try {
        const teachers = await Teacher.find();// récupérer tous les enseignants dans la base 
        res.json(teachers);// Envoi de la liste en réponse 
    } catch (err) {
        res.status(500).json({ msg: "Erreur lors de la récupération des enseignants" });
    }
};
// mise à jour du status des enseignants 
export const updateTeacherStatus = async (req, res) => {
    try {
        const teacher = await Teacher.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true });
        res.json(teacher);
    } catch (err) {
        res.status(500).json({ msg: "Erreur lors de la mise à jour du status de l'enseignant" });
    }
};
