# 🎯 Résumé du Déploiement - TP 05

## ✨ Fichiers Créés et Modifiés

### 📁 Structure créée:

```
project-root/
├── .github/
│   └── workflows/
│       ├── ci.yml                    ✅ Tests automatiques
│       └── cd-frontend.yml           ✅ Déploiement automatique
├── server/
│   ├── config/
│   │   └── config.json               ✅ Configuration Sequelize
│   ├── src/
│   │   └── config/
│   │       └── database.ts           ✅ Mis à jour (variables env)
│   ├── .env.example                  ✅ Template variables env
│   └── .gitignore                    ✅ Nouveau
├── client/
│   ├── .env.development              ✅ Variables dev
│   ├── .env.production               ✅ Variables production
│   └── .gitignore                    ✅ Nouveau
├── DEPLOYMENT_GUIDE.md               ✅ Guide complet étape par étape
├── DEPLOYMENT_CHECKLIST.md           ✅ Checklist pré-déploiement
└── README_DEPLOYMENT.md              ✅ Ce fichier
```

---

## 🔄 Processus de Déploiement

```
┌─────────────────────────────────────────────────────┐
│        1️⃣  PRÉPARATION VPS (Manuel)                  │
│  - SSH au VPS                                       │
│  - Installer Docker & Nginx                         │
│  - Configurer firewall                              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│     2️⃣  CONFIGURATION BASE DE DONNÉES (Local)       │
│  - Créer projet Supabase PostgreSQL                 │
│  - Exécuter migrations Sequelize                    │
│  - Vérifier les tables créées                       │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│    3️⃣  BUILD & PUSH DOCKER (Local)                  │
│  - docker build -t user/mon-api:latest .            │
│  - docker push user/mon-api:latest                  │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│   4️⃣  LANCER CONTAINER (VPS)                        │
│  - docker pull user/mon-api:latest                  │
│  - docker run (avec DATABASE_URL en env)            │
│  - Vérifier: curl localhost:3000/api/users          │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│     5️⃣  BUILD FRONTEND (Local)                      │
│  - npm run build (génère dist/)                     │
│  - Utilise .env.production avec IP VPS              │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│    6️⃣  DÉPLOYER FRONTEND (Local → VPS)              │
│  - scp -r dist/* user@ip:/var/www/html/             │
│  - Vérifier: http://YOUR_IP/                        │
└─────────────────────────────────────────────────────┘
                        ↓
┌─────────────────────────────────────────────────────┐
│   7️⃣  CONFIGURER CI/CD (GitHub)                     │
│  - Ajouter 3 secrets dans Settings:                 │
│    • SERVER_IP                                      │
│    • SERVER_USER                                    │
│    • SSH_PRIVATE_KEY                                │
│  - À chaque push: tests automatiques (CI)           │
│  - À chaque push main: déploiement auto (CD)        │
└─────────────────────────────────────────────────────┘
```

---

## 📋 Valeurs à Remplacer

Partout dans les fichiers de configuration, remplacez :

| Placeholder | Valeur Réelle | Où la Trouver |
|------------|----------------|----------------|
| `YOUR_VPS_IP` | `91.134.137.211` | ✅ Configuré |
| `YOUR_VPS_USER` | `devops` | ✅ Configuré |
| `YOUR_VPS_PORT` | `54321` | ✅ Configuré |
| `YOUR_DOCKERHUB_USER` | `rayanlebg` | ✅ Configuré |
| `YOUR_SUPABASE_PASSWORD` | `X3IRAYHAMIDE2006@` | ✅ Configuré |
| `YOUR_SUPABASE_HOST` | `db.zdgcijmaxrtudrvdrvku.supabase.co` | ✅ Configuré |

---

## 🔐 Données Sensibles - Points Critiques

### ⚠️ NE PAS commit sur GitHub:

```
❌ Passwords
❌ API Keys  
❌ Database URLs
❌ SSH Private Keys
❌ Fichiers .env (sauf .env.example)
```

### ✅ À LA PLACE:

```
✅ Utilisez .env.example comme template
✅ GitHub Secrets pour CI/CD
✅ Variables d'environnement sur le VPS
✅ Fichiers .env dans .gitignore
```

---

## 🚀 Commandes Essentielles

### Backend (Docker)

```bash
# Build local
docker build -t YOUR_DOCKERHUB_USER/mon-api:latest .

# Push vers DockerHub
docker push YOUR_DOCKERHUB_USER/mon-api:latest

# Sur le VPS - lancer
sudo docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://..." \
  YOUR_DOCKERHUB_USER/mon-api:latest

# Voir les logs
sudo docker logs <container_id>

# Arrêter
sudo docker stop <container_id>
```

### Frontend (SCP)

```bash
# Build
npm run build

# Déployer (depuis le dossier client/)
scp -r ./dist/* YOUR_VPS_USER@YOUR_VPS_IP:/var/www/html/
```

### VPS (SSH)

```bash
# Se connecter
ssh YOUR_VPS_USER@YOUR_VPS_IP

# Vérifier les services
sudo systemctl status docker
sudo systemctl status nginx

# Redémarrer
sudo systemctl restart nginx
```

---

## ✅ Checklist Avant Déploiement

- [ ] Lire le `DEPLOYMENT_GUIDE.md` complètement
- [ ] Vérifier `DEPLOYMENT_CHECKLIST.md`
- [ ] Remplacer TOUTES les valeurs `YOUR_*` par les vraies
- [ ] Vérifier que `server/config/config.json` a les bonnes infos Supabase
- [ ] Tester localement: `npm run build` pour le frontend
- [ ] Tester localement: `docker build .` pour le backend
- [ ] Vérifier que `.env` est dans `.gitignore`
- [ ] Configurer les 3 GitHub Secrets
- [ ] Avoir accès SSH au VPS

---

## 📞 Troubleshooting Rapide

| Problème | Solution |
|----------|----------|
| "Connection refused" sur l'API | Vérifier que le Docker container tourne: `sudo docker ps` |
| Frontend affiche "Cannot GET /" | Vérifier que les fichiers sont dans `/var/www/html/` |
| Erreur Supabase SSL | Vérifier `dialectOptions.ssl` dans `config.json` |
| GitHub Actions échoue | Vérifier les 3 secrets dans Settings → Secrets |
| SCP permission denied | Transférer vers `/home/user/` puis `sudo mv` |

---

## 📚 Documentation Liée

- 📖 [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Guide complet étape par étape
- ✅ [DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md) - Checklist pré-déploiement
- 🐳 [server/Dockerfile](./server/Dockerfile) - Configuration Docker
- ⚙️ [server/config/config.json](./server/config/config.json) - Configuration Sequelize
- 🔄 [.github/workflows/ci.yml](./.github/workflows/ci.yml) - Tests automatiques
- 🚀 [.github/workflows/cd-frontend.yml](./.github/workflows/cd-frontend.yml) - Déploiement automatique

---

## 🎓 Résumé du Cours TP 05

Ce TP vous apprend:

1. **Conteneurisation** - Docker pour garantir la portabilité
2. **Déploiement** - Transférer une application en production
3. **Bases de Données** - PostgreSQL/Supabase en production
4. **CI/CD** - Automatisation avec GitHub Actions
5. **Sécurité** - Variables d'environnement, secrets, etc.

---

**C'est prêt! Suivez étape par étape le DEPLOYMENT_GUIDE.md et laissez GitHub Actions automatiser la suite! 🚀**
