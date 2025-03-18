import multer from 'multer';
import path from 'path';

// Dossier où les fichiers seront stockés
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');  // Dossier 'uploads'
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));  // Renommer le fichier avec un timestamp
    },
});

// Filtrer les types de fichiers autorisés (PPT, PDF, Vidéo)
const fileFilter = (req, file, cb) => {
    const allowedTypes = ['application/pdf', 'application/vnd.ms-powerpoint', 'video/mp4', 'video/x-msvideo'];
    if (allowedTypes.includes(file.mimetype)) {
        cb(null, true);  // Si type valide
    } else {
        cb(new Error('Invalid file type'), false);  // Sinon erreur
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 10 * 1024 * 1024 }, // Limite de taille de fichier (10MB)
});

export default upload;  // Exportation par défaut

