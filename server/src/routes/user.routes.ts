// server/src/routes/user.routes.ts
import { Router } from 'express';
import User from '../models/project.user';
import { loginUser, registerUser, deleteUser, getUserById, updateUser, uploadUserAvatar, testUploadFolder } from '../controllers/projects.controller';
import { createProject, getAllProjects, deleteProject, getProjectById, addVideoToProject, deleteVideoFromProject, deleteImage, updateProject, toggleProjectFavorite, getUserFavorites } from '../controllers/projects.controller'
import { uploadImage } from '../middlewars/uploadImage';
import { uploadProjectMedia } from '../middlewars/uploadProjectMedia';


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
 *     summary: Créer un nouveau projet (avec ou sans upload d'image/vidéo locale)
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
 *               video:
 *                 type: string
 *                 format: binary
 *                 description: Fichier vidéo local à uploader (optionnel, MP4/MOV/AVI max 100MB)
 *               videoLink:
 *                 type: string
 *                 example: https://youtu.be/example
 *                 description: Lien vers une vidéo externe (optionnel, si pas de fichier vidéo)
 *               videoTitle:
 *                 type: string
 *                 description: Titre de la vidéo (optionnel)
 *               Uid:
 *                 type: integer
 *                 example: 1
 *               composants:
 *                 type: string
 *                 description: JSON stringifié des composants
 *               etapes:
 *                 type: string
 *                 description: JSON stringifié des étapes/tâches
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
router.post('/NewProject', uploadProjectMedia, createProject);


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
 * /api/users/{userId}/favoris:
 *   get:
 *     summary: Récupère les projets favorisés par un utilisateur
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: integer
 *         example: 1
 *     responses:
 *       200:
 *         description: Liste des projets favorisés
 *       404:
 *         description: Utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.get('/:userId/favoris', getUserFavorites);

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
 * /api/users/project/{id}:
 *   put:
 *     summary: Mettre à jour un projet
 *     tags: [Projects]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               difficulty:
 *                 type: string
 *               duration:
 *                 type: string
 *               date:
 *                 type: string
 *                 format: date
 *               isPublic:
 *                 type: boolean
 *               imageUrl:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *               videoLink:
 *                 type: string
 *               videoTitle:
 *                 type: string
 *               composants:
 *                 type: string
 *                 description: JSON stringifié des composants
 *               etapes:
 *                 type: string
 *                 description: JSON stringifié des étapes/tâches
 *     responses:
 *       200:
 *         description: Projet mis à jour avec succès
 *       400:
 *         description: URL vidéo invalide
 *       404:
 *         description: Projet non trouvé
 *       500:
 *         description: Erreur lors de la mise à jour
 */
router.put('/project/:id', uploadProjectMedia, updateProject);

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

/**
 * @swagger
 * /api/users/project/{projectId}/video:
 *   post:
 *     summary: Ajouter une vidéo à un projet existant
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               videoLink:
 *                 type: string
 *                 example: "https://www.youtube.com/embed/dQw4w9WgXcQ"
 *                 description: URL externe de la vidéo (YouTube, Vimeo, etc.)
 *               videoTitle:
 *                 type: string
 *                 example: "Titre de la vidéo"
 *                 description: Titre de la vidéo
 *               VId:
 *                 type: integer
 *                 example: 5
 *                 description: ID d'une vidéo existante (alternative à videoLink)
 *     responses:
 *       201:
 *         description: Vidéo ajoutée avec succès
 *       400:
 *         description: URL invalide ou paramètres manquants
 *       404:
 *         description: Projet ou vidéo non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/project/:projectId/video', addVideoToProject);

/**
 * @swagger
 * /api/users/project/{projectId}/favorite:
 *   post:
 *     summary: Ajouter ou retirer un projet des favoris
 *     tags: [Favorites]
 *     parameters:
 *       - in: path
 *         name: projectId
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
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: integer
 *                 example: 1
 *     responses:
 *       200:
 *         description: Statut des favoris mis à jour
 *       400:
 *         description: Données manquantes
 *       404:
 *         description: Projet ou utilisateur non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.post('/project/:projectId/favorite', toggleProjectFavorite);

/**
 * @swagger
 * /api/users/project/{projectId}/video/{videoId}:
 *   delete:
 *     summary: Supprimer une vidéo d'un projet
 *     tags: [Videos]
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID du projet
 *       - in: path
 *         name: videoId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de la vidéo à supprimer
 *     responses:
 *       200:
 *         description: Vidéo supprimée du projet
 *       404:
 *         description: Projet ou vidéo non trouvé
 *       500:
 *         description: Erreur serveur
 */
router.delete('/project/:projectId/video/:videoId', deleteVideoFromProject);

/**
 * @swagger
 * /api/users/image/{imageId}:
 *   delete:
 *     summary: Supprimer une image
 *     tags: [Images]
 *     parameters:
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID de l'image à supprimer
 *     responses:
 *       200:
 *         description: Image supprimée avec succès
 *       404:
 *         description: Image non trouvée
 *       500:
 *         description: Erreur serveur
 */
router.delete('/image/:imageId', deleteImage);

export default router;