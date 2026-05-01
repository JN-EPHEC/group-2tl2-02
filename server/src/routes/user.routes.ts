// server/src/routes/user.routes.ts
import { Router } from 'express';
import User from '../models/project.user';
import { loginUser, registerUser } from '../controllers/projects.controller';
import { createProject, getAllProjects } from '../controllers/projects.controller'

const router = Router();

// Cette route répondra à : GET http://localhost:3000/api/users/
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll(); // Sequelize récupère tout dans Postgres
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur DB", error });
    }
});

router.post('/register', registerUser);
router.post('/login', loginUser);

router.post('/NewProject', createProject);
router.get('/AllProject', getAllProjects);


export default router;