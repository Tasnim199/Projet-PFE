import express from 'express';
import connectDB from './config/db.js';
import dotenv from 'dotenv';
import cors from 'cors';
import adminRoute from './routes/adminRoute.js';
import contentRoute from './routes/contentRoute.js';
import moduleRoute from './routes/moduleRoute.js';
import levelRoute from './routes/levelRoute.js';
import bodyParser from 'body-parser';

dotenv.config();

// Se connecter à MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT;

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

app.use('/admin', adminRoute);
app.use('/content', contentRoute);
app.use('/module', moduleRoute);
app.use('/level', levelRoute); 
// test
app.get('/', (req, res) => {
res.send('API en cours d\'exécution...');
});

// Démarrer le serveur
app.listen(PORT, () => {
console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
});
