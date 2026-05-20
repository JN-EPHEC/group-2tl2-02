import { Request, Response, NextFunction } from 'express';
import { checkIdParam } from '../checkIdParam';

const mockRequest = (params: object): Request => ({ params } as unknown as Request);
const mockResponse = () => {
    const res: any = {};
    res.status = jest.fn().mockReturnValue(res);
    res.json = jest.fn().mockReturnValue(res);
    return res as Response;
};
const mockNext: NextFunction = jest.fn();

describe('checkIdParam middleware', () => {
    beforeEach(() => jest.clearAllMocks());

    it('appelle next() si id est un nombre valide', () => {
        const req = mockRequest({ id: '5' });
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
        expect(res.status).not.toHaveBeenCalled();
    });

    it('retourne 400 si id est NaN', () => {
        const req = mockRequest({ id: 'abc' });
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID invalide' });
        expect(mockNext).not.toHaveBeenCalled();
    });

    it('retourne 400 si id est 0', () => {
        const req = mockRequest({ id: '0' });
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID invalide' });
    });

    it('retourne 400 si id est négatif', () => {
        const req = mockRequest({ id: '-3' });
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({ message: 'ID invalide' });
    });

    it('appelle next() si id est 1', () => {
        const req = mockRequest({ id: '1' });
        const res = mockResponse();
        checkIdParam(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });
});