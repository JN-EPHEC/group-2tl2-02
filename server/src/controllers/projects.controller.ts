import { Request, Response } from 'express';
import { validatePassword, hashPassword, comparePassword } from '../utils/Password'; 
import { isValidEmail } from '../utils/emailValidator';
import { Project, Image, User, video, Tâche, Composant, History } from '../models/lien_inter/index';
import { Model } from 'sequelize';



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
        const { title, description, difficulty, duration, date, isPublic, imageUrl, Uid, VId, CId, TId } = req.body;


        

        const newProject = await Project.create({
            title,
            description,
            difficulty,
            duration,
            date,
            isPublic
        });

        if (imageUrl) {
            const newImage = await Image.create({ I_img: imageUrl });
            await (newProject as any).addImage(newImage); 
        }
        if (Uid) {

            await (newProject as any).addAuteurs(Uid);
        }
        if (VId) {
            await (newProject as any).addVideo(VId);

        }
        if (Uid) {

            await (newProject as any).addFavoris(Uid);
        }

        if (CId) {

            await (newProject as any).addComposant(CId);
        }
        if (TId) {
            await (newProject as any).addTâche(TId);
        }

        res.status(201).json(newProject);
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
                    attributes: ['pseudo'],
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
                    as: 'favoris'
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
            where: { id: id }
        });

        if (deleted) {
            return res.status(200).json({ message: "Utilisateur supprimé." });
        }

        return res.status(404).json({ message: "Utilisateur non trouvé." });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur", error });
    }
};


export const Visite_Enregistrer = async (req: Request, res: Response) => {
    try {
        const { userId, projectId } = req.body;

        
        await History.upsert({
            userId,
            projectId,
            visitedAt: new Date()
        });

        res.status(200).json({ message: "Visite enregistrée" });
    } catch (error) {
        res.status(500).json({ message: "Erreur history", error });
    }
};

export const getVisite = async (req: Request, res: Response) => {
    try {
        const { userId } = req.params;

        
        const user = await User.findByPk(Number(userId), {
            include: [{
                model: Project,
                as: 'VisitedProjects', 
                through: { attributes: [] }, 
                attributes: ['id', 'title', 'description'] 
            }],
          
            order: [[ { model: Project, as: 'VisitedProjects' }, History, 'visitedAt', 'DESC' ]],
            limit: 4
        });

        if (!user) {
            return res.status(404).json({ message: "Utilisateur non trouvé" });
        }

        
        const projects = user.get('VisitedProjects');

        res.status(200).json(projects || []);
    } catch (error) {
        console.error("Erreur récup history:", error);
        res.status(500).json({ message: "Erreur serveur lors de la récupération de l'historique" });
    }
};