
jest.mock('fs', () => ({
    existsSync: jest.fn().mockReturnValue(true),
    mkdirSync: jest.fn(),
}));

jest.mock('multer', () => {
    const multerMock: any = jest.fn(() => ({
        single: jest.fn(),
        array: jest.fn(),
        fields: jest.fn(),
    }));
    multerMock.diskStorage = jest.fn().mockReturnValue({});
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
        let capturedFileFilter: Function | null = null;
        (multer as unknown as jest.Mock).mockImplementationOnce((options: any) => {
            capturedFileFilter = options.fileFilter;
            return { single: jest.fn() };
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedFileFilter) {
            const cb = jest.fn();
            capturedFileFilter({}, { mimetype: 'image/jpeg' }, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        }
    });

    it('accepte les fichiers image/png', () => {
        let capturedFileFilter: Function | null = null;
        (multer as unknown as jest.Mock).mockImplementationOnce((options: any) => {
            capturedFileFilter = options.fileFilter;
            return { single: jest.fn() };
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedFileFilter) {
            const cb = jest.fn();
            capturedFileFilter({}, { mimetype: 'image/png' }, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        }
    });

    it('refuse les fichiers non image (ex: pdf)', () => {
        let capturedFileFilter: Function | null = null;
        (multer as unknown as jest.Mock).mockImplementationOnce((options: any) => {
            capturedFileFilter = options.fileFilter;
            return { single: jest.fn() };
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedFileFilter) {
            const cb = jest.fn();
            capturedFileFilter({}, { mimetype: 'application/pdf' }, cb);
            expect(cb).toHaveBeenCalledWith(expect.any(Error));
        }
    });

    it('accepte les fichiers image/gif', () => {
        let capturedFileFilter: Function | null = null;
        (multer as unknown as jest.Mock).mockImplementationOnce((options: any) => {
            capturedFileFilter = options.fileFilter;
            return { single: jest.fn() };
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedFileFilter) {
            const cb = jest.fn();
            capturedFileFilter({}, { mimetype: 'image/gif' }, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        }
    });

    it('accepte les fichiers image/webp', () => {
        let capturedFileFilter: Function | null = null;
        (multer as unknown as jest.Mock).mockImplementationOnce((options: any) => {
            capturedFileFilter = options.fileFilter;
            return { single: jest.fn() };
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedFileFilter) {
            const cb = jest.fn();
            capturedFileFilter({}, { mimetype: 'image/webp' }, cb);
            expect(cb).toHaveBeenCalledWith(null, true);
        }
    });

    it('teste la destination du storage multer', () => {
        let capturedDestination: Function | null = null;
        (multer.diskStorage as jest.Mock).mockImplementationOnce((options: any) => {
            capturedDestination = options.destination;
            return {};
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedDestination) {
            const cb = jest.fn();
            capturedDestination({}, {}, cb);
            expect(cb).toHaveBeenCalledWith(null, expect.any(String));
        }
    });

    it('teste le filename du storage multer', () => {
        let capturedFilename: Function | null = null;
        (multer.diskStorage as jest.Mock).mockImplementationOnce((options: any) => {
            capturedFilename = options.filename;
            return {};
        });

        jest.isolateModules(() => {
            require('../uploadImage');
        });

        if (capturedFilename) {
            const cb = jest.fn();
            capturedFilename({}, { originalname: 'test.jpg' }, cb);
            expect(cb).toHaveBeenCalledWith(null, expect.stringMatching(/\d+-\d+\.jpg$/));
        }
    });
});