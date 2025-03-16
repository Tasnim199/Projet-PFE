import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();
//connexion à la base de données MongoDB Atlas 
const connectDB = async () => {
    try {
      await mongoose.connect(process.env.DB_URL)
 console.log('Connecté à MongoDB');
    } catch(error) {
    console.error('Erreur de connexion à MongoDB:', error);
    }
};
export default connectDB; // Exportation de la fonction pour pouvoir l'utiliser ailleurs dans l'application