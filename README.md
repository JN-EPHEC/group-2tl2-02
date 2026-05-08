# 🚀 PROJET_DEV3
> Système de gestion pour projets d'électronique.

## 📌 Présentation
Ce projet est le backend d'une application de gestion de composants et de schémas électroniques. Il est structuré pour être robuste, typé et facile à maintenir.

## 🛠️ Stack Technique

### 🖥️ Frontend (Dossier /client)
* **HTML5** : Structure des pages de l'interface.
* **CSS3** : Mise en forme et design responsive.
* **JavaScript (Vanilla)** : Interactions dynamiques côté client.

### ⚙️ Backend (Dossier /server)
* **Runtime** : Node.js (v20+)
* **Langage** : TypeScript (Typage fort pour la sécurité).
* **Outils** : `nodemon`, `ts-node`.

## 📂 Structure du Projet
```text
PROJET_DEV3/
├── client/           # Interface utilisateur (Frontend)
├── server/           # Logique métier (Backend)
│   ├── src/          # Fichiers sources (.ts)
│   ├── dist/         # Fichiers compilés (.js)
│   └── package.json  # Configuration et scripts
├── .gitignore        # Fichiers exclus de Git
└── README.md
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
