import { Request, Response } from 'express';
import { validatePassword, hashPassword, comparePassword } from '../utils/Password'; 
import { isValidEmail } from '../utils/emailValidator';
import { Project, Image, User, video } from '../models/lien_inter/index';


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
        const { title, description, difficulty, duration, date, imageUrl, Uid, VId } = req.body;


        let newImage = null;
        if (imageUrl) {
            newImage = await Image.create({ I_img: imageUrl });
        }

        const newProject = await Project.create({
            title,
            description,
            difficulty,
            duration,
            date,
            I_id: newImage ? newImage.getDataValue('I_id') : null
        });

        if (Uid) {

            await (newProject as any).addAuteurs(Uid);
        }
        if (VId) {
            await (newProject as any).addVideo(VId);

        }
        if (Uid) {

            await (newProject as any).addFavoris(Uid);
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
                }
            ]
        });

        res.status(200).json(projects);
    } catch (error) {
        console.error("Erreur récup :", error);
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};
