import { displayBanner } from './startup';
import express from 'express';
import { User, Project, Image } from './models/lien_inter/index' // Vérifie bien que le nom du fichier est correct
import sequelize from './config/database';
import userRoutes from './routes/user.routes'; // 1. Importation
import { requestLogger } from './middlewars/logger'
import { errorHandler } from './middlewars/errorHandler';
import { checkIdParam } from './middlewars/checkIdParam';

const app = express();
app.use(express.json());
const port = 3000;


app.use(requestLogger);

// ... après app.use(express.json())
app.use('/api/users', userRoutes); // 2. Utilisation



//  route pour la bannière
app.get('/api/data', (req, res) => {
    res.send(User);
});

app.use(errorHandler);


// --- LE BLOC DE SYNCHRO (C'est ici que tout se joue) ---
sequelize.sync({ force: true })
    .then(() => {
        console.log("✅ Base de données PostgreSQL synchronisée");

        // On lance le serveur SEULEMENT quand la DB est prête
        app.listen(port, () => {
            console.log(displayBanner()); // On affiche la bannière dans la console
            console.log(`🚀 Serveur lancé sur : http://localhost:${port}/api/users`);
        });
    })
    .catch((error) => {
        console.error("❌ Erreur lors de la synchronisation :", error);
    });
