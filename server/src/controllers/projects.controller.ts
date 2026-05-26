import { Request, Response } from 'express';
import { validatePassword, hashPassword, comparePassword } from '../utils/Password'; 
import { isValidEmail } from '../utils/emailValidator';
import { isValidVideoUrl } from '../utils/urlValidator';
import { Project, Image, User, video, Tâche, Composant } from '../models/lien_inter/index';
import { Model } from 'sequelize';
import fs from 'fs';
import path from 'path';



// login et inscription :
export const registerUser = async (req: Request, res: Response) => {
    try {

        const { firstName, lastName, email, password, age, bio, pseudo } = req.body;


        if (!validatePassword(password, age)) {
            return res.status(400).json({
                message: "Le mot de passe ne respecte pas les règles de sécurité pour ton groupe d'âge."
            });
        }
        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "L'email n'est pas valide." });
        }
        const hashedPassword = await hashPassword(password);


        const newUser = await User.create({
            firstName,
            lastName,
            email,
            password: hashedPassword,
            age,
            bio,
            pseudo
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès !",
            user: { id: newUser.getDataValue('Uid'), email: newUser.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
};

export const loginUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;


        if (!isValidEmail(email)) {
            return res.status(400).json({ message: "Format d'email invalide." });
        }

        const user = await User.findOne({ where: { email: email } }); 

        if (!user) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: "Email ou mot de passe incorrect." });
        }


        res.status(200).json({
            message: `Bienvenue ${user.firstName} !`,
            user: { id: user.Uid, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
};

// get project et nouveau projet :
export const createProject = async (req: Request, res: Response) => {
    try {
        console.log('DEBUG createProject - req.body:', req.body);
        console.log('DEBUG createProject - req.files:', (req as any).files);
        let { title, description, difficulty, duration, date, isPublic, imageUrl, Uid, VId, CId, TId, composants, etapes, videoLink, videoTitle } = req.body;

        if (typeof composants === 'string') {
            try {
                composants = JSON.parse(composants);
            } catch {
                composants = []; // Si c'est pas du JSON valide, on ignore
            }
        }
        if (typeof etapes === 'string') {
            try {
                etapes = JSON.parse(etapes);
            } catch {
                etapes = []; // Si c'est pas du JSON valide, on ignore
            }
        }

     
        const newProject = await Project.create({
            title,
            description,
            difficulty,
            duration,
            date,
            isPublic
        });

        // Cas 1 : Image uploadée via multipart/form-data (fichier)
        const files = (req as any).files;
        if (files && files.image && files.image.length > 0) {
            const imageFile = files.image[0];
            const localPath = `/uploads/images/${imageFile.filename}`;
            const newImage = await Image.create({
                I_img: localPath,
                I_fileName: imageFile.originalname,
                I_url: `http://localhost:3000${localPath}`
            });
            await (newProject as any).addImage(newImage);
        } 
        // Cas 2 : Image via URL (JSON)
        else if (imageUrl) {
            const newImage = await Image.create({
                I_img: imageUrl,
                I_url: imageUrl
            });
            await (newProject as any).addImage(newImage);
        }

        let projectUser = null;
        if (Uid !== undefined && Uid !== null && Uid !== '') {
            const uidNumber = Number(Uid);
            if (!Number.isNaN(uidNumber) && uidNumber > 0) {
                projectUser = await User.findByPk(uidNumber);
            }
            if (projectUser) {
                try {
                    await (newProject as any).addAuteurs(projectUser);
                } catch (userError) {
                    console.warn(`Impossible d'ajouter l'auteur pour Uid=${Uid}:`, userError);
                }
            } else {
                console.warn(`Utilisateur introuvable ou Uid invalide (${Uid}) ; associations ignorées.`);
            }
        }

        // Gestion des vidéos
        // Cas 1 : Vidéo uploadée via multipart/form-data (fichier)
        if (files && files.video && files.video.length > 0) {
            const videoFile = files.video[0];
            const videoUrl = `http://localhost:3000/uploads/videos/${videoFile.filename}`;
            const newVideo = await video.create({
                type: 'local',
                mp4: videoUrl,
                lien: null,
                titre: videoTitle || videoFile.originalname,
            });
            await (newProject as any).addVideo(newVideo);
        }
        // Cas 3 : Vidéo via lien externe (URL)
        else if (videoLink) {
            if (!isValidVideoUrl(videoLink)) {
                return res.status(400).json({ message: "L'URL de la vidéo n'est pas valide." });
            }
            const newVideo = await video.create({
                type: 'link',
                lien: videoLink.trim(),
                titre: (videoTitle || videoLink).trim(),
                mp4: null
            });
            await (newProject as any).addVideo(newVideo);
        }
        // Cas 4 : ID vidéo existante
        else if (VId) {
            await (newProject as any).addVideo(VId);
        }

        if (Array.isArray(composants) && composants.length > 0) {
            const createdComposants = await Promise.all(
                composants
                    .filter((comp: any) => typeof comp.nom === 'string' && comp.nom.trim() !== '')
                    .map((comp: any) => Composant.create({ nom: comp.nom.trim(), possédé: false }))
            );
            if (createdComposants.length > 0) {
                await (newProject as any).addComposant(createdComposants);
            }
        }

        if (Array.isArray(etapes) && etapes.length > 0) {
            const createdTaches = await Promise.all(
                etapes
                    .filter((etape: any) =>
                        (typeof etape.titre === 'string' && etape.titre.trim() !== '') ||
                        (typeof etape.description === 'string' && etape.description.trim() !== '')
                    )
                    .map((etape: any) =>
                        Tâche.create({
                            title: typeof etape.titre === 'string' ? etape.titre.trim() : '',
                            instruction: typeof etape.description === 'string' ? etape.description.trim() : ''
                        })
                    )
            );
            if (createdTaches.length > 0) {
                await (newProject as any).addTâche(createdTaches);
            }
        }

        const fullProject = await Project.findByPk((newProject as any).id || (newProject as any).PId, {
            include: [
                { model: Image, as: 'Image' },
                { model: User, as: 'Auteurs', through: { attributes: [] }, attributes: ['Uid', 'pseudo', 'firstName'] },
                { model: video, as: 'video', through: { attributes: [] } },
                { model: Composant, as: 'composant', through: { attributes: [] } },
                { model: Tâche, as: 'Tâche', through: { attributes: [] } },
                { model: User, as: 'favoris', through: { attributes: [] } }
            ]
        });

        res.status(201).json({
            message: "Projet créé avec succès",
            project: fullProject,
            id: (fullProject as any)?.id || (fullProject as any)?.PId
        });
    } catch (error) {
        console.error("Détail de l'erreur :", error);
        res.status(500).json({ message: "Erreur creation", error });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const viewerId = Number(req.query?.viewerUid || req.query?.viewerId || req.query?.userId);
        const hasViewerId = Number.isInteger(viewerId) && viewerId > 0;

        const commonInclude = [
            {
                model: Image,
                as: 'Image', // Doit être identique à l'alias dans index.ts
                attributes: ['I_id', 'I_img'] // Optionnel : pour être sûr d'avoir les bons champs
            },
            {
                model: User,
                as: 'Auteurs',
                attributes: ['Uid', 'pseudo', 'firstName'],
                through: { attributes: [] }
            },
            {
                model: video,
                as: 'video',
                attributes: ['VId', 'type', 'mp4', 'lien', 'titre'],
                through: { attributes: [] }
            },
            {
                model: User,
                as: 'favoris',
                through: { attributes: [] },
                attributes: ['Uid', 'pseudo'] 
            },
            {
                model: Composant,
                as: 'composant',
                attributes: ['nom', 'possédé'],
                through: { attributes: [] }
            },
            {
                model: Tâche,
                as: 'Tâche',
                attributes: ['title', 'instruction'],
                through: { attributes: [] }
            }
        ];

        let projects;
        if (!hasViewerId) {
            projects = await Project.findAll({
                where: { isPublic: true },
                include: commonInclude
            });
        } else {
            const publicProjects = await Project.findAll({
                where: { isPublic: true },
                include: commonInclude
            });
            const ownPrivateProjects = await Project.findAll({
                where: { isPublic: false },
                include: commonInclude
            });
            const privateVisible = ownPrivateProjects.filter((project: any) =>
                Array.isArray(project.Auteurs) && project.Auteurs.some((author: any) => author.Uid === viewerId)
            );
            const allIds = new Set<number>();
            projects = [...publicProjects, ...privateVisible].filter((project: any) => {
                const id = project.id ?? project.PId ?? project.getDataValue?.('id');
                if (id == null) return true;
                if (allIds.has(id)) return false;
                allIds.add(id);
                return true;
            });
        }

        res.status(200).json(projects);
    } catch (error) {
        console.error("Erreur récup :", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};

export const updateProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        let { title, description, difficulty, duration, date, isPublic, imageUrl, composants, etapes, videoLink, videoTitle } = req.body;


        if (typeof composants === 'string') {
            try { composants = JSON.parse(composants); } catch { composants = []; }
        }
        if (typeof etapes === 'string') {
            try { etapes = JSON.parse(etapes); } catch { etapes = []; }
        }

        const project = await Project.findByPk(Number(id));
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé." });
        }

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (description !== undefined) updateData.description = description;
        if (difficulty !== undefined) updateData.difficulty = difficulty;
        if (duration !== undefined) updateData.duration = duration;
        if (date !== undefined) updateData.date = date;
        if (isPublic !== undefined) updateData.isPublic = isPublic;

        await project.update(updateData);

        // Mise à jour image via fichier uploadé
        const files = (req as any).files;
        if (files && files.image && files.image.length > 0) {
            const imageFile = files.image[0];
            const localPath = `/uploads/images/${imageFile.filename}`;
            const newImage = await Image.create({
                I_img: localPath,
                I_fileName: imageFile.originalname,
                I_url: `http://localhost:3000${localPath}`
            });
            await (project as any).addImage(newImage);
        } else if (imageUrl) {
            const newImage = await Image.create({ I_img: imageUrl, I_url: imageUrl });
            await (project as any).addImage(newImage);
        }

        // Mise à jour vidéo
        if (videoLink) {
            if (!isValidVideoUrl(videoLink)) {
                return res.status(400).json({ message: "L'URL de la vidéo n'est pas valide." });
            }
            const newVideo = await video.create({
                type: 'link',
                lien: videoLink.trim(),
                titre: (videoTitle || videoLink).trim(),
                mp4: null
            });
            await (project as any).addVideo(newVideo);
        }

        // Mise à jour composants
        if (Array.isArray(composants) && composants.length > 0) {
            const createdComposants = await Promise.all(
                composants
                    .filter((comp: any) => typeof comp.nom === 'string' && comp.nom.trim() !== '')
                    .map((comp: any) => Composant.create({ nom: comp.nom.trim(), possédé: comp.possédé ?? false }))
            );
            if (createdComposants.length > 0) {
                await (project as any).setComposant(createdComposants); // setX remplace les anciens
            }
        }

        // Mise à jour étapes/tâches
        if (Array.isArray(etapes) && etapes.length > 0) {
            const createdTaches = await Promise.all(
                etapes
                    .filter((etape: any) =>
                        (typeof etape.titre === 'string' && etape.titre.trim() !== '') ||
                        (typeof etape.description === 'string' && etape.description.trim() !== '')
                    )
                    .map((etape: any) => Tâche.create({
                        title: typeof etape.titre === 'string' ? etape.titre.trim() : '',
                        instruction: typeof etape.description === 'string' ? etape.description.trim() : ''
                    }))
            );
            if (createdTaches.length > 0) {
                await (project as any).setTâche(createdTaches); // setX remplace les anciens
            }
        }

        // Retourner le projet complet mis à jour
        const updatedProject = await Project.findByPk(Number(id), {
            include: [
                { model: Image, as: 'Image', attributes: ['I_id', 'I_img'] },
                { model: User, as: 'Auteurs', through: { attributes: [] }, attributes: ['Uid', 'pseudo', 'firstName'] },
                { model: video, as: 'video', attributes: ['VId', 'type', 'mp4', 'lien', 'titre'], through: { attributes: [] } },
                { model: Composant, as: 'composant', through: { attributes: [] } },
                { model: Tâche, as: 'Tâche', through: { attributes: [] } },
                { model: User, as: 'favoris', through: { attributes: [] }, attributes: ['Uid', 'pseudo'] }
            ]
        });

        res.status(200).json({
            message: "Projet mis à jour avec succès.",
            project: updatedProject
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du projet", error });
    }
};

export const deleteProject = async (req: Request, res: Response) => {
    try {
        const { id } = req.params; 

        const deleted = await Project.destroy({
            where: { id: id }
        });

        if (deleted) {
            return res.status(200).json({ message: "Projet supprimé avec succès." });
        }

        return res.status(404).json({ message: "Projet non trouvé." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression du projet", error });
    }
};
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await User.destroy({
            where: { Uid: id }
        });

        if (deleted) {
            return res.status(200).json({ message: "Utilisateur supprimé." });
        }

        return res.status(404).json({ message: "Utilisateur non trouvé." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
    }
};


export const getUserById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(Number(id), {
            include: [
                { model: Image, as: 'Avatar', through: { attributes: [] } }
            ],
            attributes: { exclude: ['password'] }
        });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });
        // Récupérer les projets dont l'utilisateur est auteur
        const projets = await Project.findAll({
            include: [
                { model: Image, as: 'Image', attributes: ['I_id', 'I_img'], through: { attributes: [] } },
                { model: User, as: 'Auteurs', where: { Uid: Number(id) }, attributes: ['Uid', 'pseudo'], through: { attributes: [] } },
                { model: video, as: 'video', attributes: ['VId', 'type', 'mp4', 'lien', 'titre'], through: { attributes: [] } },
                { model: Composant, as: 'composant', through: { attributes: [] } },
                { model: Tâche, as: 'Tâche', through: { attributes: [] } }
            ]
        });

        // Récupérer les projets favorisés par l'utilisateur
        const favoris = await Project.findAll({
            include: [
                { model: User, as: 'favoris', where: { Uid: Number(id) }, attributes: ['Uid'], through: { attributes: [] } },
                { model: Image, as: 'Image', attributes: ['I_id', 'I_img'], through: { attributes: [] } },
                { model: User, as: 'Auteurs', through: { attributes: [] }, attributes: ['Uid', 'pseudo'] }
            ]
        });

        // Préparer les stats
        const projetsCount = Array.isArray(projets) ? projets.length : 0;
        const favorisCount = Array.isArray(favoris) ? favoris.length : 0;

        // Répondre avec l'utilisateur et ses projets/favoris
        res.status(200).json({
            ...user.toJSON(),
            Auteurs: projets,
            Favoris: favoris,
            stats: {
                projets: projetsCount,
                favoris: favorisCount,
                badges: (user as any).Badge ? (Array.isArray((user as any).Badge) ? (user as any).Badge.length : 0) : 0
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const updateUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { firstName, lastName, email, bio, pseudo, age, password } = req.body;

        const user = await User.findByPk(Number(id));
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé." });
        }

        const updateData: any = {};
        if (firstName !== undefined) updateData.firstName = firstName;
        if (lastName !== undefined) updateData.lastName = lastName;
        if (email !== undefined) {
            if (!isValidEmail(email)) {
                return res.status(400).json({ message: "L'email n'est pas valide." });
            }
            updateData.email = email;
        }
        if (bio !== undefined) updateData.bio = bio;
        if (pseudo !== undefined) updateData.pseudo = pseudo;
        if (age !== undefined) updateData.age = age;
        if (password !== undefined && password !== "") {
            if (!validatePassword(password, age || (user as any).age)) {
                return res.status(400).json({ message: "Le mot de passe ne respecte pas les règles de sécurité pour ton groupe d'âge." });
            }
            updateData.password = await hashPassword(password);
        }

        await user.update(updateData);

        res.status(200).json({
            message: "Profil mis à jour avec succès.",
            user: {
                id: user.Uid,
                pseudo: user.pseudo,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                bio: user.bio,
                age: user.age
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la mise à jour du profil", error });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const viewerId = Number(req.query?.viewerUid || req.query?.viewerId || req.query?.userId);
        const hasViewerId = Number.isInteger(viewerId) && viewerId > 0;

        const project = await Project.findByPk(Number(id), {
            include: [
                { 
                    model: Image, 
                    as: 'Image', 
                    attributes: ['I_id', 'I_img'] 
                },
                { 
                    model: User, 
                    as: 'Auteurs', 
                    through: { attributes: [] },
                    attributes: ['Uid', 'pseudo', 'firstName']
                },
                { 
                    model: video, 
                    as: 'video', 
                    attributes: ['VId', 'type', 'mp4', 'lien', 'titre'],
                    through: { attributes: [] } 
                },
                { 
                    model: Composant, 
                    as: 'composant', 
                    through: { attributes: [] } 
                },
                { 
                    model: Tâche, 
                    as: 'Tâche', 
                    through: { attributes: [] } 
                },
                { 
                    model: User, 
                    as: 'favoris', 
                    through: { attributes: [] },
                    attributes: ['Uid', 'pseudo'] 
                }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        if (project.isPublic !== true) {
            const authors: any[] = (project as any).Auteurs || [];
            const isAuthor = hasViewerId && authors.some((author) => author.Uid === viewerId);
            if (!isAuthor) {
                return res.status(403).json({ message: "Ce projet est privé. Accès refusé." });
            }
        }

        res.status(200).json(project);
    } catch (error) {
        console.error("Erreur getProjectById:", error);
        res.status(500).json({ message: "Erreur lors de la récupération du projet", error });
    }
};

// Uploader un avatar pour un utilisateur
export const uploadUserAvatar = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        // Vérifier que l'utilisateur existe
        const user = await User.findByPk(Number(id));
        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        // Vérifier qu'une image a été uploadée
        if (!(req as any).file) {
            return res.status(400).json({ message: "Aucune image fournie" });
        }

        // Créer la nouvelle image
        const localPath = `/uploads/images/${(req as any).file.filename}`;
        const newImage = await Image.create({
            I_img: localPath,
            I_fileName: (req as any).file.originalname,
            I_url: `http://localhost:3000${localPath}`
        });

        // Ajouter l'image comme avatar de l'utilisateur
        await (user as any).addAvatar(newImage);

        res.status(201).json({
            message: "Avatar téléchargé avec succès",
            avatar: {
                I_id: newImage.I_id,
                I_img: newImage.I_img,
                I_url: newImage.I_url
            }
        });
    } catch (error) {
        console.error("Erreur upload avatar:", error);
        res.status(500).json({ message: "Erreur lors du téléchargement de l'avatar", error });
    }
};

// Test : Vérifier que le dossier uploads existe et est accessible
export const testUploadFolder = async (req: Request, res: Response) => {
    try {
        const uploadDir = path.join(__dirname, '../../uploads/images');

        // Créer le dossier s'il n'existe pas
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }

        // Vérifier que le dossier existe maintenant
        const exists = fs.existsSync(uploadDir);

        // Lire les fichiers du dossier
        let files: string[] = [];
        if (exists) {
            files = fs.readdirSync(uploadDir).filter(f => !f.startsWith('.'));
        }

        res.status(200).json({
            message: "Test du dossier uploads réussi",
            uploadPath: uploadDir,
            folderExists: exists,
            isWritable: exists && fs.accessSync(uploadDir, fs.constants.W_OK) ? true : false,
            filesCount: files.length,
            files: files,
            timestamp: new Date()
        });
    } catch (error) {
        console.error("Erreur test upload folder:", error);
        res.status(500).json({
            message: "Erreur lors du test du dossier uploads",
            error: (error as any).message
        });
    }
};

// Ajouter une vidéo à un projet existant
export const addVideoToProject = async (req: Request, res: Response) => {
    try {
        const { projectId } = req.params;
        const { videoLink, videoTitle, VId } = req.body;

        // Vérifier que le projet existe
        const project = await Project.findByPk(Number(projectId));
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        // Cas 1 : Ajouter un lien vidéo externe
        if (videoLink) {
            if (!isValidVideoUrl(videoLink)) {
                return res.status(400).json({ message: "L'URL de la vidéo n'est pas valide." });
            }
            
            const title = videoTitle || videoLink;
            const newVideo = await video.create({
                type: 'link',
                lien: videoLink,
                titre: title,
                mp4: null
            });
            
            await (project as any).addVideo(newVideo);
            
            return res.status(201).json({
                message: "Vidéo ajoutée avec succès",
                video: {
                    VId: newVideo.VId,
                    type: newVideo.type,
                    lien: newVideo.lien,
                    titre: newVideo.titre
                }
            });
        }
        
        // Cas 2 : Ajouter une vidéo existante par son ID
        if (VId) {
            const existingVideo = await video.findByPk(Number(VId));
            if (!existingVideo) {
                return res.status(404).json({ message: "Vidéo non trouvée" });
            }
            
            await (project as any).addVideo(existingVideo);
            
            return res.status(201).json({
                message: "Vidéo existante ajoutée au projet",
                video: {
                    VId: existingVideo.VId,
                    type: existingVideo.type,
                    lien: existingVideo.lien,
                    titre: existingVideo.titre
                }
            });
        }

        return res.status(400).json({ message: "Fournir videoLink ou VId" });
    } catch (error) {
        console.error("Erreur add video to project:", error);
        res.status(500).json({ message: "Erreur lors de l'ajout de la vidéo", error });
    }
};

// Supprimer une vidéo d'un projet
export const deleteVideoFromProject = async (req: Request, res: Response) => {
    try {
        const { projectId, videoId } = req.params;

        const project = await Project.findByPk(Number(projectId));
        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
        }

        const videoToDelete = await video.findByPk(Number(videoId));
        if (!videoToDelete) {
            return res.status(404).json({ message: "Vidéo non trouvée" });
        }

        // Retirer la vidéo du projet (déassociation)
        await (project as any).removeVideo(videoToDelete);

        res.status(200).json({ message: "Vidéo supprimée du projet avec succès" });
    } catch (error) {
        console.error("Erreur delete video from project:", error);
        res.status(500).json({ message: "Erreur lors de la suppression de la vidéo", error });
    }
};

// Supprimer une image
export const deleteImage = async (req: Request, res: Response) => {
    try {
        const { imageId } = req.params;

        const image = await Image.findByPk(Number(imageId));
        if (!image) {
            return res.status(404).json({ message: "Image non trouvée" });
        }

        // Supprimer le fichier du disque si c'est un chemin local
        const imagePath = (image as any).I_img;
        if (imagePath && imagePath.startsWith('/uploads/')) {
            const fullPath = path.join(__dirname, '../../..', imagePath);
            if (fs.existsSync(fullPath)) {
                try {
                    fs.unlinkSync(fullPath);
                } catch (fileError) {
                    console.warn("Impossible de supprimer le fichier image:", fileError);
                }
            }
        }

        // Supprimer l'image de la base de données
        await Image.destroy({
            where: { I_id: Number(imageId) }
        });

        res.status(200).json({ message: "Image supprimée avec succès" });
    } catch (error) {
        console.error("Erreur delete image:", error);
        res.status(500).json({ message: "Erreur lors de la suppression de l'image", error });
    }
};