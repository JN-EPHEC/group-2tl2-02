
import express from 'express';
import path from 'path';
import { User, Project, Image } from './models/lien_inter/index'
import sequelize from './config/database';
import userRoutes from './routes/user.routes';
import { requestLogger } from './middlewars/logger'
import { errorHandler } from './middlewars/errorHandler';
import { checkIdParam } from './middlewars/checkIdParam';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger';


const app = express();
app.use(express.json());

// 👇 Servir les fichiers statiques du dossier uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

const port = 3000;

app.use(requestLogger);

app.use('/api/users', userRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// 👇 Seulement pour les vrais IDs numériques
app.use('/api/users/:id', checkIdParam);
app.use('/api/projects/:id', checkIdParam);

app.get('/api/data', (req, res) => {
    res.send(User);
});


app.use(errorHandler);


sequelize.sync({ alter: true })
    .then(() => {
        console.log("✅ Base de données PostgreSQL synchronisée");

        app.listen(port, () => {
            console.log(`🚀 Serveur lancé sur : http://localhost:${port}/api/users`);
            console.log(`📄 Swagger dispo sur : http://localhost:${port}/api-docs`);
        });
    })
    .catch((error) => {
        console.error("❌ Erreur lors de la synchronisation :", error);
    });