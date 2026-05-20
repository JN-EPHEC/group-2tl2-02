import { Request, Response, NextFunction } from 'express';
import { errorHandler } from '../errorHandler';

const mockRequest = (): Request => ({} as Request);
const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};
const mockNext: NextFunction = jest.fn();

describe('errorHandler middleware', () => {
    beforeEach(() => jest.clearAllMocks());

    it('retourne 500 et message par défaut si pas de status/message', () => {
        const req = mockRequest();
        const res = mockResponse();
        const err = {};
        errorHandler(err, req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Erreur serveur' });
    });

    it('retourne le status et message de l erreur', () => {
        const req = mockRequest();
        const res = mockResponse();
        const err = { status: 404, message: 'Non trouvé' };
        errorHandler(err, req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(404);
        expect(res.json).toHaveBeenCalledWith({ message: 'Non trouvé' });
    });

    it('retourne 400 avec message personnalisé', () => {
        const req = mockRequest();
        const res = mockResponse();
        const err = { status: 400, message: 'Requête invalide' };
        errorHandler(err, req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'Requête invalide' });
    });

    it('retourne 401 avec message personnalisé', () => {
        const req = mockRequest();
        const res = mockResponse();
        const err = { status: 401, message: 'Non autorisé' };
        errorHandler(err, req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'Non autorisé' });
    });
});