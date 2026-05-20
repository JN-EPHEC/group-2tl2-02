# 📋 Guide des Tests et Couverture de Code

## Installation

Les dépendances de test sont déjà installées. Si besoin :
```bash
npm install --save-dev jest @types/jest ts-jest supertest @types/supertest
```

## Scripts de Test

### Lancer tous les tests
```bash
npm run test
```

### Lancer les tests en mode "watch" (automatique)
```bash
npm run test:watch
```

### Générer un rapport de couverture de code
```bash
npm run test:coverage
```

## Structure des Tests

Les tests sont organisés dans des dossiers `__tests__` à côté du code testé :

```
src/
├── controllers/
│   ├── projects.controller.ts
│   └── __tests__/
│       ├── registerUser.test.ts
│       ├── loginUser.test.ts
│       ├── createProject.test.ts
│       └── testUploadFolder.test.ts
```

## Fichiers de Test Actuels

### 1. **registerUser.test.ts**
Tests de la création d'utilisateur :
- ✅ Enregistrement réussi
- ✅ Email invalide
- ✅ Mot de passe non conforme
- ✅ Gestion des erreurs BD

### 2. **loginUser.test.ts**
Tests de connexion :
- ✅ Connexion réussie
- ✅ Email invalide
- ✅ Utilisateur non trouvé
- ✅ Mot de passe incorrect

### 3. **createProject.test.ts**
Tests de création de projet :
- ✅ Création simple
- ✅ Création avec URL image
- ✅ Création avec upload fichier
- ✅ Gestion des erreurs
- ✅ Ajout d'auteur

### 4. **testUploadFolder.test.ts**
Tests de la fonction de test du dossier :
- ✅ Vérifier l'existence du dossier
- ✅ Créer le dossier s'il n'existe pas
- ✅ Gestion des erreurs de permissions
- ✅ Filtrage des fichiers cachés

## Rapport de Couverture

Après avoir lancé `npm run test:coverage`, vous trouverez :

- **Terminal** : Résumé du coverage en texte
- **coverage/index.html** : Rapport HTML détaillé (ouvrir dans le navigateur)
- **coverage/lcov.info** : Format compatible avec les outils CI/CD

## Exemple : Générer le rapport et l'ouvrir

```bash
# Générer la couverture
npm run test:coverage

# Ouvrir le rapport HTML (Windows)
start coverage/index.html

# Ou (Mac/Linux)
open coverage/index.html
```

## Objectifs de Couverture

Actuellement, les tests couvrent les fonctions critiques :
- ✅ Authentification (registerUser, loginUser)
- ✅ Gestion de projets (createProject)
- ✅ Validation du système d'upload

## Comment ajouter des tests

Pour tester une nouvelle fonction, créez un fichier `.test.ts` dans `__tests__` :

```typescript
// src/utils/__tests__/Password.test.ts
import { validatePassword } from '../Password';

describe('validatePassword', () => {
    it('should validate a strong password', () => {
        const result = validatePassword('StrongPass123!', '25');
        expect(result).toBe(true);
    });
});
```

Puis lancez `npm run test` pour vérifier.

## Intégration CI/CD

Vous pouvez ajouter les tests à votre pipeline CI/CD (GitHub Actions, etc.) :

```yaml
- name: Run tests
  run: npm run test

- name: Generate coverage
  run: npm run test:coverage
```

---

**Besoin d'aide ?** Consultez la [documentation Jest](https://jestjs.io/fr/).
