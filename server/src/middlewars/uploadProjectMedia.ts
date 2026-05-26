import multer from 'multer';
import path from 'path';
import fs from 'fs';

const imageUploadDir = path.join(__dirname, '../../uploads/images');
const videoUploadDir = path.join(__dirname, '../../uploads/videos');

if (!fs.existsSync(imageUploadDir)) {
    fs.mkdirSync(imageUploadDir, { recursive: true });
}
if (!fs.existsSync(videoUploadDir)) {
    fs.mkdirSync(videoUploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'image') {
            cb(null, imageUploadDir);
        } else if (file.fieldname === 'video') {
            cb(null, videoUploadDir);
        } else {
            cb(new Error('Champ de fichier inconnu'), '');
        }
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: any, cb: any) => {
    if (file.fieldname === 'image') {
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format d\'image non supporté. Accepté: JPEG, PNG, GIF, WEBP'), false);
        }
    } else if (file.fieldname === 'video') {
        const allowedMimes = ['video/mp4', 'video/quicktime', 'video/x-msvideo'];
        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Format de vidéo non supporté. Accepté: MP4, MOV, AVI'), false);
        }
    }
};

export const uploadProjectMedia = multer({ 
    storage,
    limits: { 
        fileSize: 100 * 1024 * 1024, // 100MB pour les vidéos
    },
    fileFilter
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'video', maxCount: 1 }
]);
