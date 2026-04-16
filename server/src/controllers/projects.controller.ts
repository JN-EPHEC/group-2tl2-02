import { Request, Response } from 'express';
import User from '../models/project.user';
import { validatePassword, hashPassword, comparePassword } from '../utils/Password'; 
import { isValidEmail } from '../utils/emailValidator';
import Project from '../models/project.create';

export const registerUser = async (req: Request, res: Response) => {
    try {

        const { firstName, lastName, email, password, age } = req.body;


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
            age 
        });

        res.status(201).json({
            message: "Utilisateur créé avec succès !",
            user: { id: newUser.id, email: newUser.email }
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
            user: { id: user.id, email: user.email }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Erreur lors de la connexion" });
    }
};
export const createProject = async (req: Request, res: Response) => {
    try {
        const { title, description } = req.body;
        const newProject = await Project.create({ title, description });
        res.status(201).json({ message: "Projet créé !", project: newProject });
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la création", error });
    }
};

export const getAllProjects = async (req: Request, res: Response) => {
    try {
        const projects = await Project.findAll();
        res.status(200).json(projects);
    } catch (error) {
        res.status(500).json({ message: "Erreur lors de la récupération", error });
    }
};