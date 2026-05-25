import { Request, Response, NextFunction } from 'express';
import { requestLogger } from '../logger';

const mockRequest = (method: string, url: string): Request =>
    ({ method, url } as unknown as Request);

const mockResponse = (): Response => ({} as Response);
const mockNext: NextFunction = jest.fn();

describe('requestLogger middleware', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.spyOn(console, 'log').mockImplementation(() => { });
    });

    afterEach(() => {
        (console.log as jest.Mock).mockRestore();
    });

    it('appelle next()', () => {
        const req = mockRequest('GET', '/api/users');
        const res = mockResponse();
        requestLogger(req, res, mockNext);
        expect(mockNext).toHaveBeenCalled();
    });

    it('logue la méthode et l url', () => {
        const req = mockRequest('POST', '/api/users/register');
        const res = mockResponse();
        requestLogger(req, res, mockNext);
        expect(console.log).toHaveBeenCalled();
        const logArg = (console.log as jest.Mock).mock.calls[0][0] as string;
        expect(logArg).toContain('POST');
        expect(logArg).toContain('/api/users/register');
    });

    it('logue un timestamp ISO', () => {
        const req = mockRequest('DELETE', '/api/users/1');
        const res = mockResponse();
        requestLogger(req, res, mockNext);
        const logArg = (console.log as jest.Mock).mock.calls[0][0] as string;
        expect(logArg).toMatch(/\d{4}-\d{2}-\d{2}T/);
    });
});