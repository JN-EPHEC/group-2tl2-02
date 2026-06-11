# 🚀 PROJET_DEV3
> Système de gestion pour projets d'électronique.

## 📌 Présentation
Cette application web permet aux utilisateurs de créer, partager et consulter des idées de projets électroniques. Chaque membre peut proposer ses propres concepts, découvrir les réalisations des autres utilisateurs et échanger autour de nouvelles idées.

L'application repose sur une architecture full stack, avec une interface utilisateur développée en React et TypeScript, ainsi qu'une API backend réalisée avec Node.js. Les données sont stockées dans une base de données PostgreSQL, garantissant une gestion fiable et structurée des informations.

L'objectif du projet est de fournir une plateforme simple et collaborative permettant aux passionnés d'électronique de partager leurs idées et de s'inspirer mutuellement pour de futurs projets.

## 🛠️ Stack Technique

### 🖥️ Frontend (Dossier /client)
* **HTML5** : Structure des pages de l'interface.
* **CSS3** : Mise en forme et design responsive.
* **React** : Interactions dynamiques côté client.

### ⚙️ Backend (Dossier /server)
* **Runtime** : Node.js (v20+)
* **Langage** : TypeScript (Typage fort pour la sécurité).
* **Outils** : `nodemon`, `ts-node`.
* **Base de Données** : Postgres.

# 📂 Structure du Projet

L'application adopte une architecture découplée (FullStack), séparant hermétiquement le client (Frontend) et le serveur (Backend).

### 🏷️ Légende
* 📁 **Dossier Principal / Module**
* 📄 **Fichier de Configuration / Script**
* 🧪 **Zone de Tests et Validation**
* 🌐 **Documentation de Déploiement Production**

---

```text
PROJET_DEV3/
├── .github/                           # Configuration des Workflows GitHub (CI/CD)
│
├── 📁 client/                         # 🖥️ APPLICATION FRONTEND (React / Vite)
│   ├── 📁 public/                     # Actifs statiques publics
│   └── 📁 src/                        # Code source de l'interface
│       ├── 📁 pages/                  # Organisation de l'application par vues
│       │   ├── 📁 connection/         # Page de connexion (connection.tsx + CSS Module)
│       │   ├── 📁 developpement/      # Statut d'avancement des fonctionnalités
│       │   ├── 📁 home/               # Page d'accueil de la plateforme
│       │   ├── 📁 info/               # Pages d'information (À propos, Contact, FAQ)
│       │   ├── 📁 panier/             # Gestion de la sélection de composants
│       │   ├── 📁 profil/             # Gestion et modification du profil utilisateur
│       │   └── 📁 projets/            # Espace de création des projets d'électronique
│       ├── 📄 App.css / App.tsx       # Routage global et styles de l'application
│       ├── 📄 index.css               # Directives CSS globales
│       └── 📄 main.tsx                # Point d'entrée de l'application React
│   ├── 📄 .env.development            # Variables d'environnement pour le développement
│   ├── 📄 .env.production             # Variables d'environnement pour la production
│   ├── 📄 eslint.config.js            # Configuration du linter de code
│   ├── 📄 index.html                  # Point d'ancrage HTML principal
│   ├── 📄 package.json                # Dépendances et scripts du Frontend
│   └── 📄 vite.config.ts              # Configuration du bundler Vite
│
├── 📁 server/                         # ⚙️ APPLICATION BACKEND (Node.js / Express)
│   ├── 📁 config/                     # Configuration globale (base de données)
│   ├── 🧪 coverage/                   # Rapports de couverture de tests générés par Jest
│   │   └── 📁 lcov-report/            # Interface HTML du rapport de couverture
│   ├── 📁 src/                        # Code source TypeScript du serveur
│   │   ├── 🧪 __mocks__/              # Mocking des données et services pour les tests
│   │   ├── 📁 config/                 # Initialisation des briques d'infrastructure
│   │   ├── 📁 controllers/            # Logique métier (Traitement des requêtes HTTP)
│   │   ├── 📁 middlewares/            # Middlewares de sécurité (JWT, filtres)
│   │   ├── 📁 models/                 # Modèles ORM Sequelize (PostgreSQL)
│   │   ├── 📁 routes/                 # Définition des endpoints de l'API REST
│   │   └── 📁 utils/                  # Fonctions utilitaires globales
│   ├── 📁 uploads/images/             # Stockage des schémas et images téléversés
│   ├── 📄 index.ts                    # Point d'entrée officiel de l'API backend
│   ├── 📄 .env.example                # Modèle de configuration des variables d'environnement
│   ├── 📄 Dockerfile                  # Configuration de conteneurisation du backend
│   ├── 🧪 jest.config.js              # Configuration de la suite de tests Jest
│   └── 🧪 TESTS.md                    # Procédures et documentation des tests
│
├── 🌐 DEPLOYMENT_CHECKLIST.md          # Liste de contrôle avant mise en production
├── 🌐 DEPLOYMENT_CONFIG.md             # Fichiers et configurations cibles du serveur
├── 🌐 DEPLOYMENT_GUIDE.md              # Guide pas-à-pas pour le déploiement VPS
├── 🌐 DEPLOYMENT_README.md             # Synthèse des requis de mise en production
├── 📄 QUICK_START.md                  # Guide de démarrage rapide en local
└── 📄 README.md                       # Documentation maîtresse à la racine du projet
```

## Trucs a installer 
### FullStack
- node module a faire dans le back et front
```bash
cd client
npm install
cd ../server
npm install
```
- truc a faire a la racine
`npm init -y`
`npm install concurrently --save-dev`
- Puis remplacer le **script** du `package.json` de la racine par :
```json
"scripts": {
  "setup": "npm install --prefix server && npm install --prefix client",
  "start:server": "npm run dev --prefix server",
  "start:client": "npm run dev --prefix client",
  "dev": "concurrently \"npm run start:server\" \"npm run start:client\""
},
```

### Frontend (`cd client`): 
- redirection pour les differentes pages :
`npm install react-router-dom`

### Backend (cd server):
- postgres (la db)
> https://www.enterprisedb.com/downloads/postgres-postgresql-downloads
