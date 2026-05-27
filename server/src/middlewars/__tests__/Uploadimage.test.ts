
jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
}));


jest.mock('multer', () => {
    const multerMock: any = jest.fn((options: any) => ({
        single: jest.fn(),
        array: jest.fn(),
        fields: jest.fn(),
    }));
    multerMock.diskStorage = jest.fn((opts: any) => opts);
    return multerMock;
});

import multer from 'multer';
import fs from 'fs';

describe('uploadImage middleware', () => {
    beforeEach(() => jest.clearAllMocks());

    it('vérifie si le dossier uploads existe au chargement', () => {
        jest.isolateModules(() => {
            require('../uploadImage');
        });
        expect(fs.existsSync).toHaveBeenCalled();
    });

    it('crée le dossier si il n existe pas', () => {
        (fs.existsSync as jest.Mock).mockReturnValueOnce(false);
        jest.isolateModules(() => {
            require('../uploadImage');
        });
        expect(fs.mkdirSync).toHaveBeenCalledWith(expect.any(String), { recursive: true });
    });

    it('ne crée pas le dossier si il existe déjà', () => {
        (fs.existsSync as jest.Mock).mockReturnValueOnce(true);
        jest.isolateModules(() => {
            require('../uploadImage');
        });
        expect(fs.mkdirSync).not.toHaveBeenCalled();
    });

    it('configure multer avec diskStorage', () => {
        jest.isolateModules(() => {
            require('../uploadImage');
        });
        expect(multer.diskStorage).toHaveBeenCalled();
    });

    it('accepte les fichiers image/jpeg', () => {
        const { fileFilter } = require('../uploadImage');
        const cb = jest.fn();
        fileFilter({}, { mimetype: 'image/jpeg' }, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('accepte les fichiers image/png', () => {
        const { fileFilter } = require('../uploadImage');
        const cb = jest.fn();
        fileFilter({}, { mimetype: 'image/png' }, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('refuse les fichiers non image (ex: pdf)', () => {
        const { fileFilter } = require('../uploadImage');
        const cb = jest.fn();
        fileFilter({}, { mimetype: 'application/pdf' }, cb);
        expect(cb).toHaveBeenCalledWith(expect.any(Error));
    });

    it('accepte les fichiers image/gif', () => {
        const { fileFilter } = require('../uploadImage');
        const cb = jest.fn();
        fileFilter({}, { mimetype: 'image/gif' }, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('accepte les fichiers image/webp', () => {
        const { fileFilter } = require('../uploadImage');
        const cb = jest.fn();
        fileFilter({}, { mimetype: 'image/webp' }, cb);
        expect(cb).toHaveBeenCalledWith(null, true);
    });

    it('teste la destination du storage multer', () => {
        const { storage } = require('../uploadImage');
        const cb = jest.fn();
        storage.destination({}, { fieldname: 'image' }, cb);
        expect(cb).toHaveBeenCalledWith(null, expect.any(String));
    });

    it('teste le filename du storage multer', () => {
        const { storage } = require('../uploadImage');
        const cb = jest.fn();
        storage.filename({}, { originalname: 'test.jpg' }, cb);
        expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/\d+-\d+\.jpg$/));
    });
});