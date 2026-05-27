# 🎬 Commencer le Déploiement - Guide Rapide

## 📝 Étape 0 : Remplacer les valeurs de base

Avant de continuer, remplacez partout dans les fichiers :

```
YOUR_VPS_IP          → 91.134.137.211
YOUR_VPS_USER        → devops
YOUR_VPS_PORT        → 54321
YOUR_DOCKERHUB_USER  → rayanlebg
YOUR_SUPABASE_PASSWORD → X3IRAYHAMIDE2006@
YOUR_SUPABASE_HOST   → db.zdgcijmaxrtudrvdrvku.supabase.co
```

**Fichiers à modifier :**
- `server/config/config.json` ✅ Déjà modifié
- `client/.env.production` ✅ Déjà modifié
- `DEPLOYMENT_GUIDE.md` ✅ Déjà modifié

---

## ⚡ Prochaines Étapes Immédiates

### 1️⃣ Créer un compte Supabase (2 min)

```bash
# Allez sur https://supabase.com
# - Connectez-vous avec GitHub
# - Créez un nouveau projet
# - Choisissez une région proche (Frankfurt ou Paris)
# - Définissez un mot de passe sécurisé
# - Copiez la connection string
```

Exemple de connection string:
```
postgresql://postgres.xxxxx:PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

### 2️⃣ Exécuter les migrations (5 min)

Sur votre machine locale dans le dossier `server/` :

```bash
# Assurez-vous que sequelize-cli est installé
npm install --save-dev sequelize-cli

# Initialisez Sequelize
npx sequelize-cli init

# Installez le driver PostgreSQL
npm i pg pg-hstore

# Exécutez les migrations
NODE_ENV=production npx sequelize-cli db:migrate
```

Vérifiez dans Supabase Dashboard (Table Editor) que les tables existent.

### 3️⃣ Builder et pousser Docker (10 min)

Dans le dossier `server/` :

```bash
# Construire
docker build -t rayanlebg/mon-api:latest .

# Se connecter à DockerHub
docker login
# Pseudo: rayanlebg
# Mot de passe: Avril2006@

# Pousser
docker push rayanlebg/mon-api:latest
```

### 4️⃣ Lancer sur le VPS (5 min)

```bash
# Se connecter au VPS
ssh devops@91.134.137.211 -p 54321

# Sur le VPS - télécharger l'image
sudo docker pull rayanlebg/mon-api:latest

# Lancer le conteneur
sudo docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://postgres:X3IRAYHAMIDE2006@db.zdgcijmaxrtudrvdrvku.supabase.co:5432/postgres" \
  rayanlebg/mon-api:latest

# Vérifier que ça marche
curl http://localhost:3000/api/users
```

### 5️⃣ Déployer le frontend (5 min)

Sur votre machine locale dans le dossier `client/` :

```bash
# Installer et builder
npm install
npm run build

# Transférer vers le VPS (depuis le dossier client/)
scp -r -P 54321 ./dist/* devops@91.134.137.211:/var/www/html/
```

### 6️⃣ Tester le déploiement (1 min)

Ouvrez votre navigateur :

```
Frontend: http://91.134.137.211/
API: http://91.134.137.211:3000/api/users
```

### 7️⃣ Configurer GitHub Actions (2 min)

1. Allez sur **Settings** → **Secrets and variables** → **Actions**
2. Créez 3 secrets :
   - `SERVER_IP` = YOUR_VPS_IP
   - `SERVER_USER` = YOUR_VPS_USER
   - `SSH_PRIVATE_KEY` = Contenu de `~/.ssh/id_rsa`

### ✅ C'est fait!

Maintenant à chaque `git push` :
- ✅ Les tests s'exécutent automatiquement (CI)
- ✅ Le frontend se déploie automatiquement si vous pushez sur `main` (CD)

---

## 🔗 Documents Complémentaires

- 📖 **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Guide complet détaillé
- ✅ **[DEPLOYMENT_CHECKLIST.md](./DEPLOYMENT_CHECKLIST.md)** - Checklist complète
- 📋 **[README_DEPLOYMENT.md](./README_DEPLOYMENT.md)** - Résumé et overview

---

## ❓ Questions Courantes

**Q: Je ne vois pas de dossier dist/**  
A: Vous devez d'abord faire `npm run build` dans le dossier client/

**Q: L'API ne répond pas**  
A: Vérifiez que le container Docker tourne: `sudo docker ps`

**Q: Les GitHub Actions échouent**  
A: Vérifiez les 3 secrets GitHub et les fichiers .env

**Q: Impossible de se connecter au VPS**  
A: Vérifiez votre IP et utilisateur SSH

---

## 🚀 Commandes Utiles à Connaître

```bash
# Docker
docker build -t image:tag .        # Builder une image
docker push image:tag              # Pousser vers DockerHub
docker ps                           # Voir les containers en cours
docker logs container_id            # Voir les logs
docker stop container_id            # Arrêter un container

# SCP (transfert de fichiers)
scp file user@ip:/path/             # Envoyer un fichier
scp -r folder user@ip:/path/        # Envoyer un dossier

# SSH
ssh user@ip                         # Se connecter
ssh user@ip 'command'               # Exécuter une commande

# Sequelize
npx sequelize-cli db:migrate        # Exécuter les migrations
npx sequelize-cli db:migrate:undo   # Annuler la dernière migration
```

---

## 🎯 Checklist Finale

- [ ] Variables d'environnement configurées
- [ ] Supabase projet créé et migration exécutée
- [ ] Docker image buildée et pushée
- [ ] Container lancé sur VPS
- [ ] Frontend buildé et copié
- [ ] GitHub Secrets configurés
- [ ] Test du déploiement réussi

---

**Vous êtes prêt! Lancez-vous dans le déploiement! 🚀**

Si vous avez des questions, consultez `DEPLOYMENT_GUIDE.md` pour plus de détails.
