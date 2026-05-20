// server/src/routes/user.routes.ts
import { Router } from 'express';
import User from '../models/project.user';
import { loginUser, registerUser, deleteUser, getUserById, updateUser, uploadUserAvatar, testUploadFolder } from '../controllers/projects.controller';
import { createProject, getAllProjects, deleteProject, getProjectById, Visite_Enregistrer, getVisite } from '../controllers/projects.controller'
import { uploadImage } from '../middlewars/uploadImage';

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         Uid:
 *           type: integer
 *         firstName:
 *           type: string
 *         lastName:
 *           type: string
 *         email:
 *           type: string
 *         pseudo:
 *           type: string
 *         age:
 *           type: string
 *         bio:
 *           type: string
 *     Project:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         difficulty:
 *           type: string
 *         duration:
 *           type: string
 *         date:
 *           type: string
 *           format: date
 *         isPublic:
 *           type: boolean
 */

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Récupère tous les utilisateurs
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Liste des utilisateurs
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Erreur base de données
 */
router.get('/', async (req, res) => {
    try {
        const users = await User.findAll();
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: "Erreur DB", error });
    }
});

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Créer un nouvel utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [firstName, lastName, email, password, pseudo]
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jean
 *               lastName:
 *                 type: string
 *                 example: Dupont
 *               email:
 *                 type: string
 *                 example: jean.dupont@gmail.com
 *               password:
 *                 type: string
 *                 example: MonMotDePasse123!
 *               pseudo:
 *                 type: string
 *                 example: jeanD
 *               age:
 *                 type: string
 *                 example: "25"
 *               bio:
 *                 type: string
 *                 example: Passionné d'électronique
 *     responses:
 *       201:
 *         description: Utilisateur créé avec succès
 *       400:
 *         description: Email invalide ou mot de passe non conforme
 *       500:
 *         description: Erreur lors de la création
 */
router.post('/register', registerUser);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Connexion d'un utilisateur
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 example: jean.dupont@gmail.com
 *               password:
 *                 type: string
 *                 example: MonMotDePasse123!
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Bienvenue Jean !
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                     email:
 *                       type: string
 *       401:
 *         description: Email ou mot de passe incorrect
 *       400:
 *         description: Format d'email invalide
 */
router.post('/login', loginUser);

/**
 * @swagger
 * /api/users/NewProject:
 *   post:
 *     summary: Créer un nouveau projet (avec ou sans upload d'image locale)
 *     tags: [Projects]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, date]
 *             properties:
 *               title:
 *                 type: string
 *                 example: Robot Arduino
 *               description:
 *                 type: string
 *                 example: Un robot autonome avec capteurs
 *               difficulty:
 *                 type: string
 *                 example: Intermédiaire
 *               duration:
 *                 type: string
 *                 example: 3 semaines
 *               date:
 *                 type: string
 *                 format: date
 *                 example: "2024-01-15"
 *               isPublic:
 *                 type: boolean
 *                 example: true
 *               imageUrl:
 *                 type: string
 *                 example: https://example.com/image.png
 *                 description: URL d'image (optionnel)
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image local à uploader (optionnel, JPEG/PNG/GIF/WEBP max 5MB)
 *               Uid:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       201:
 *         description: Projet créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       400:
 *         description: Erreur validation
 *       500:
 *         description: Erreur création
 */
router.post('/NewProject', uploadImage.single('image'), createProject);

/**
 * @swagger
 * /api/users/AllProject:
 *   get:
 *     summary: Récupère tous les projets avec leurs relations
 *     tags: [Projects]
 *     responses:
 *       200:
 *         description: Liste des projets avec images, auteurs, vidéos, composants et tâches
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Project'
 *       500:
 *         description: Erreur lors de la récupération
 */
router.get('/AllProject', getAllProjects);
/**
 * @swagger
 * /api/users/history:
 *   post:
 *     summary: Enregistrer une visite d'un projet par un utilisateur
 *     tags: [History]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, projectId]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *               projectId:
 *                 type: integer
 *                 example: 2
 *     responses:
 *       200:
 *         description: Visite enregistrée
 *       500:
 *         description: Erreur serveur
 */
router.post('/history', Visite_Enregistrer);

/**
 * @swagger
 * /api/users/history/{userId}:
 *   get:
 *     summary: Récupère les 4 derniers projets visités par un utilisateur
 *     tags: [History]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste des projets récemment visités
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   id:
 *                     type: integer
 *                   title:
 *                     type: string
 *                   description:
 *                     type: string
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/history/:userId', getVisite);

/**
 * @swagger
 * /api/users/project/{id}:
 *   get:
 *     summary: Récupère un projet par ID avec toutes ses relations
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Projet trouvé avec images, auteurs, vidéos, composants et tâches
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Project'
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/project/:id', getProjectById);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Récupère un utilisateur par ID avec ses stats
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Utilisateur trouvé avec stats (projets, favoris, badges)
 *         content:
 *           application/json:
 *             schema:
 *               allOf:
 *                 - $ref: '#/components/schemas/User'
 *                 - type: object
 *                   properties:
 *                     stats:
 *                       type: object
 *                       properties:
 *                         projets:
 *                           type: integer
 *                         favoris:
 *                           type: integer
 *                         badges:
 *                           type: integer
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:id', getUserById);

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Mettre à jour le profil d'un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               bio:
 *                 type: string
 *               pseudo:
 *                 type: string
 *               age:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil mis à jour avec succès
 *       400:
 *         description: Email invalide ou mot de passe non conforme
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.put('/:id', updateUser);

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Supprimer un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Utilisateur supprimé avec succès
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete('/:id', deleteUser);

/**
 * @swagger
 * /api/users/project/{id}:
 *   delete:
 *     summary: Supprimer un projet
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Projet supprimé avec succès
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur lors de la suppression
 */
router.delete('/project/:id', deleteProject);

/**
 * @swagger
 * /api/users/{id}/avatar:
 *   post:
 *     summary: Uploader un avatar pour un utilisateur
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'utilisateur
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: Fichier image (JPEG, PNG, GIF, WEBP - max 5MB)
 *     responses:
 *       201:
 *         description: Avatar téléchargé avec succès
 *       400:
 *         description: Erreur validation (image non supportée, fichier trop gros)
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/:id/avatar', uploadImage.single('image'), uploadUserAvatar);

/**
 * @swagger
 * /api/users/test/upload-folder:
 *   get:
 *     summary: Tester la configuration du dossier d'upload
 *     tags: [Test]
 *     description: |
 *       Vérifie que le dossier `/uploads/images` existe et est accessible.
 *       Si le dossier n'existe pas, il sera créé automatiquement.
 *       Retourne :
 *       - L'état du dossier (existe/créé)
 *       - Si le dossier est accessible en écriture
 *       - La liste des fichiers uploadés
 *     responses:
 *       200:
 *         description: Test réussi - Dossier OK
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 uploadPath:
 *                   type: string
 *                   example: "C:\\Users\\...\\server\\uploads\\images"
 *                 folderExists:
 *                   type: boolean
 *                   example: true
 *                 isWritable:
 *                   type: boolean
 *                   example: true
 *                 filesCount:
 *                   type: integer
 *                   example: 5
 *                 files:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["image1.jpg", "image2.png"]
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *       500:
 *         description: Erreur lors du test
 */
router.get('/test/upload-folder', testUploadFolder);

export default router;