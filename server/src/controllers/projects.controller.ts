import { Request, Response } from 'express';
import { validatePassword, hashPassword, comparePassword } from '../utils/Password'; 
import { isValidEmail } from '../utils/emailValidator';
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
        const { title, description, difficulty, duration, date, isPublic, imageUrl, Uid, VId, CId, TId, composants, etapes } = req.body;
     
     
        const newProject = await Project.create({
            title,
            description,
            difficulty,
            duration,
            date,
            isPublic
        });

        // Cas 1 : Image uploadée via multipart/form-data (fichier)
        if ((req as any).file) {
            const localPath = `/uploads/images/${(req as any).file.filename}`;
            const newImage = await Image.create({
                I_img: localPath,
                I_fileName: (req as any).file.originalname,
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

        if (VId) {
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

        res.status(201).json({
            message: "Projet créé avec succès",
            project: newProject
        });
    } catch (error) {
        console.error("Détail de l'erreur :", error);
        res.status(500).json({ message: "Erreur creation", error });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll({
            include: [
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
                    attributes: ['mp4', 'lien'],
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
            ]
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error("Erreur récup :", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
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
        
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Erreur serveur", error });
    }
};

export const getProjectById = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

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
                    attributes: ['Uid', 'pseudo', 'firstName']  // 👈 'id' → 'Uid'
                },
                { 
                    model: video, 
                    as: 'video', 
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
                    attributes: ['Uid', 'pseudo']  // 👈 'id' → 'Uid'
                }
            ]
        });

        if (!project) {
            return res.status(404).json({ message: "Projet non trouvé" });
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