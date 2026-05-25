import { validatePassword, hashPassword, comparePassword } from '../Password';

// On mock bcrypt pour ne pas faire de vrai hachage dans les tests
jest.mock('bcrypt', () => ({
    hash: jest.fn().mockResolvedValue('hashed_password'),
    compare: jest.fn().mockResolvedValue(true),
}));

// =====================
// validatePassword
// =====================
describe('validatePassword', () => {

    // --- Règles communes ---
    it('retourne false si mot de passe vide', () => {
        expect(validatePassword('', 25)).toBe(false);
    });

    it('retourne false si mot de passe trop court (< 8)', () => {
        expect(validatePassword('Ab1!', 25)).toBe(false);
    });

    it('retourne false si mot de passe trop long (> 20)', () => {
        expect(validatePassword('Ab1!Ab1!Ab1!Ab1!Ab1!Ab', 25)).toBe(false);
    });

    // --- Moins de 12 ans : seulement une minuscule requise ---
    it('retourne true pour age < 12 avec au moins une minuscule', () => {
        expect(validatePassword('abcdefgh', 8)).toBe(true);
    });

    it('retourne false pour age < 12 sans minuscule', () => {
        expect(validatePassword('ABCDEFGH', 8)).toBe(false);
    });

    // --- Entre 12 et 64 ans : majuscule + minuscule + chiffre + spécial ---
    it('retourne true pour age 25 avec mot de passe fort', () => {
        expect(validatePassword('Pass123!', 25)).toBe(true);
    });

    it('retourne false pour age 25 sans majuscule', () => {
        expect(validatePassword('pass123!', 25)).toBe(false);
    });

    it('retourne false pour age 25 sans minuscule', () => {
        expect(validatePassword('PASS123!', 25)).toBe(false);
    });

    it('retourne false pour age 25 sans chiffre', () => {
        expect(validatePassword('Password!', 25)).toBe(false);
    });

    it('retourne false pour age 25 sans caractère spécial', () => {
        expect(validatePassword('Password1', 25)).toBe(false);
    });

    it('retourne true pour age exactement 12', () => {
        expect(validatePassword('Pass123!', 12)).toBe(true);
    });

    it('retourne true pour age exactement 64', () => {
        expect(validatePassword('Pass123!', 64)).toBe(true);
    });

    // --- 65 ans et plus : chiffre OU majuscule suffit ---
    it('retourne true pour age >= 65 avec un chiffre', () => {
        expect(validatePassword('abcdefg1', 65)).toBe(true);
    });

    it('retourne true pour age >= 65 avec une majuscule', () => {
        expect(validatePassword('Abcdefgh', 70)).toBe(true);
    });

    it('retourne false pour age >= 65 sans chiffre ni majuscule', () => {
        expect(validatePassword('abcdefgh', 70)).toBe(false);
    });
});

// =====================
// hashPassword
// =====================
describe('hashPassword', () => {
    it('retourne un hash depuis bcrypt', async () => {
        const result = await hashPassword('Pass123!');
        expect(result).toBe('hashed_password');
    });

    it('appelle bcrypt.hash avec le bon mot de passe et saltRounds=10', async () => {
        const bcrypt = require('bcrypt');
        await hashPassword('MonMotDePasse!');
        expect(bcrypt.hash).toHaveBeenCalledWith('MonMotDePasse!', 10);
    });
});

// =====================
// comparePassword
// =====================
describe('comparePassword', () => {
    it('retourne true si le mot de passe correspond au hash', async () => {
        const result = await comparePassword('Pass123!', 'hashed_password');
        expect(result).toBe(true);
    });

    it('retourne false si le mot de passe ne correspond pas', async () => {
        const bcrypt = require('bcrypt');
        bcrypt.compare.mockResolvedValueOnce(false);
        const result = await comparePassword('mauvais', 'hashed_password');
        expect(result).toBe(false);
    });

    it('appelle bcrypt.compare avec les bons arguments', async () => {
        const bcrypt = require('bcrypt');
        await comparePassword('Pass123!', 'hashed_password');
        expect(bcrypt.compare).toHaveBeenCalledWith('Pass123!', 'hashed_password');
    });
});