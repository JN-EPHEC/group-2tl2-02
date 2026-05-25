import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Répertoires pour les uploads
const imageDir = path.join(__dirname, '../../uploads/images');
const videoDir = path.join(__dirname, '../../uploads/videos');

// Créer les répertoires s'ils n'existent pas
[imageDir, videoDir].forEach(dir => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
});

// Configuration du stockage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, imageDir);
        } else if (file.fieldname === 'video') {
            cb(null, videoDir);
        } else {
            cb(new Error('Champ de fichier inconnu'));
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

// Filtre de fichiers
const fileFilter = (req: any, file: any, cb: any) => {
    if (file.fieldname === 'image') {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format d\'image non supporté. Accepté: JPEG, PNG, GIF, WEBP'));
        }
    } else if (file.fieldname === 'video') {
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format de vidéo non supporté. Accepté: MP4, MOV, AVI'));
        }
    } else {
        cb(new Error('Champ de fichier inconnu'));
    }
};

export const uploadMediaFiles = multer({ 
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
    fileFilter
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);
