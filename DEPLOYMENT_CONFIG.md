# 🔐 Configuration Finale - Informations Déploiement

## ✅ Toutes tes informations sont configurées!

### 🌐 Serveur VPS

```
IP          : 91.134.137.211
Utilisateur : devops
Port SSH    : 54321
Commande    : ssh devops@91.134.137.211 -p 54321
```

### 🐳 Docker Hub

```
Pseudo      : rayanlebg
Mot de passe: Avril2006@
Image       : rayanlebg/mon-api:latest
```

### 🗄️ Supabase PostgreSQL

```
Host        : db.zdgcijmaxrtudrvdrvku.supabase.co
Port        : 5432
Database    : postgres
Username    : postgres
Password    : X3IRAYHAMIDE2006@

Connection String:
postgresql://postgres:X3IRAYHAMIDE2006@db.zdgcijmaxrtudrvdrvku.supabase.co:5432/postgres

API URL     : http://91.134.137.211:3000/api
Frontend URL: http://91.134.137.211/
```

---

## 📋 Étapes à Faire

### 1️⃣ Préparer Supabase (LOCAL)

```bash
cd server/

# Installer Sequelize CLI
npm install --save-dev sequelize-cli

# Initialiser
npx sequelize-cli init

# Installer PostgreSQL driver
npm i pg pg-hstore

# Exécuter les migrations
NODE_ENV=production npx sequelize-cli db:migrate

# Vérifier: Allez sur https://supabase.com dashboard → Table Editor
# Vérifiez que vos tables existent
```

### 2️⃣ Builder et Pousser Docker (LOCAL)

```bash
cd server/

# Build
docker build -t rayanlebg/mon-api:latest .

# Login Docker
docker login
# Pseudo: rayanlebg
# Mot de passe: Avril2006@

# Push
docker push rayanlebg/mon-api:latest
```

### 3️⃣ Lancer sur le VPS

```bash
# Se connecter
ssh devops@91.134.137.211 -p 54321

# Sur le VPS:
sudo docker pull rayanlebg/mon-api:latest

# Lancer le container
sudo docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://postgres:X3IRAYHAMIDE2006@db.zdgcijmaxrtudrvdrvku.supabase.co:5432/postgres" \
  rayanlebg/mon-api:latest

# Vérifier
curl http://localhost:3000/api/users
```

### 4️⃣ Déployer le Frontend (LOCAL)

```bash
cd client/

# Build
npm install
npm run build

# Transférer
scp -r -P 54321 ./dist/* devops@91.134.137.211:/var/www/html/
```

### 5️⃣ Configurer GitHub Secrets

1. Allez sur GitHub → Settings → Secrets and variables → Actions
2. Créez 3 secrets:

| Nom | Valeur |
|-----|--------|
| `SERVER_IP` | `91.134.137.211` |
| `SERVER_USER` | `devops` |
| `SSH_PRIVATE_KEY` | Contenu de `~/.ssh/id_rsa` (toute la clé) |

**Comment obtenir la clé SSH:**
```bash
# Sur votre machine locale
cat ~/.ssh/id_rsa
# Copiez TOUT le contenu (BEGIN à END inclus)
```

---

## 🎯 Tester le Déploiement

```bash
# Frontend
http://91.134.137.211/

# API
http://91.134.137.211:3000/api/users

# Swagger (documentation API)
http://91.134.137.211:3000/api-docs
```

---

## 🔄 Tests Automatiques (GitHub Actions)

Une fois les secrets configurés:

1. **CI (Tests)** - À chaque push:
   - Les tests s'exécutent automatiquement

2. **CD (Déploiement)** - À chaque push sur `main`:
   - Le frontend se compile et se déploie automatiquement

Pour tester:
```bash
# Modifiez un texte visible dans le frontend (ex: titre h1)
git add .
git commit -m "Test deployment"
git push origin main

# Allez sur GitHub → Actions et regardez le workflow s'exécuter
```

---

## ⚡ Commandes Rapides

```bash
# SSH au VPS
ssh devops@91.134.137.211 -p 54321

# Voir les containers Docker
sudo docker ps

# Voir les logs
sudo docker logs <container_id>

# Arrêter un container
sudo docker stop <container_id>

# Redémarrer Nginx
sudo systemctl restart nginx

# Vérifier les services
sudo systemctl status docker
sudo systemctl status nginx
```

---

## ✨ Résumé - Tout est Prêt!

- ✅ `server/config/config.json` - Supabase configuré
- ✅ `client/.env.production` - IP VPS configurée
- ✅ `.github/workflows/ci.yml` - Tests auto
- ✅ `.github/workflows/cd-frontend.yml` - Déploiement auto (port 54321 inclus)
- ✅ Tous les guides modifiés avec tes vraies valeurs

**Prochaine étape: Suivre QUICK_START.md 🚀**

---

## 📝 Notes Importantes

⚠️ **N'oubliez pas:**
- Le port SSH du VPS est **54321** (pas 22!)
- Les GitHub Secrets doivent être configurés **avant** de pusher
- La clé SSH privée doit avoir les permissions correctes: `chmod 600 ~/.ssh/id_rsa`

✅ **Données sensibles sécurisées:**
- Le mot de passe Supabase et la connection string ne sont que dans config.json (pas sur GitHub)
- Les credentials Docker ne sont que dans ce fichier
- GitHub Secrets stockent la clé SSH de façon sécurisée
