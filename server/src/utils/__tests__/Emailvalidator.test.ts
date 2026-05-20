import { isValidEmail } from '../emailValidator';

describe('isValidEmail', () => {
    it('retourne true pour un email valide', () => {
        expect(isValidEmail('jean.dupont@gmail.com')).toBe(true);
    });

    it('retourne true pour un email avec sous-domaine', () => {
        expect(isValidEmail('user@mail.domain.com')).toBe(true);
    });

    it('retourne false si pas de @', () => {
        expect(isValidEmail('jeandupont.com')).toBe(false);
    });

    it('retourne false si pas de point', () => {
        expect(isValidEmail('jean@gmailcom')).toBe(false);
    });

    it('retourne false si chaine vide', () => {
        expect(isValidEmail('')).toBe(false);
    });

    it('retourne false si seulement @', () => {
        expect(isValidEmail('@')).toBe(false);
    });

    it('retourne false si seulement un point', () => {
        expect(isValidEmail('.')).toBe(false);
    });

    it('retourne true pour un email court valide', () => {
        expect(isValidEmail('a@b.c')).toBe(true);
    });
});