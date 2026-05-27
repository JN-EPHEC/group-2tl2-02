# 🚀 COMMENCER MAINTENANT - Plan d'Action

Toutes tes infos sont configurées! Voici ce que tu dois faire maintenant.

## ⏱️ Estimation: 45 minutes pour tout déployer

---

## Phase 1: Préparer la Base de Données (5 min)

### Sur ta machine locale, dans le dossier `server/`:

```bash
# 1. Installer Sequelize CLI
npm install --save-dev sequelize-cli

# 2. Initialiser Sequelize
npx sequelize-cli init

# 3. Installer le driver PostgreSQL
npm i pg pg-hstore

# 4. Exécuter les migrations
NODE_ENV=production npx sequelize-cli db:migrate
```

**Vérifier:** Allez sur https://supabase.com → Dashboard → Table Editor
Vous devez voir vos tables (users, projects, etc.)

---

## Phase 2: Builder et Pousser Docker (10 min)

### Dans le dossier `server/`:

```bash
# 1. Build
docker build -t rayanlebg/mon-api:latest .

# 2. Login Docker
docker login
# Entrez:
# - Pseudo: rayanlebg
# - Mot de passe: Avril2006@

# 3. Push
docker push rayanlebg/mon-api:latest

# Vérifier: Allez sur https://hub.docker.com → rayanlebg → mon-api
# Vous devez voir l'image `latest`
```

---

## Phase 3: Lancer le Container sur le VPS (5 min)

### Se connecter au VPS:

```bash
ssh devops@91.134.137.211 -p 54321
# Entrez le mot de passe si demandé
```

### Sur le VPS:

```bash
# 1. Pull l'image Docker
sudo docker pull rayanlebg/mon-api:latest

# 2. Lancer le container
sudo docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://postgres:X3IRAYHAMIDE2006@db.zdgcijmaxrtudrvdrvku.supabase.co:5432/postgres" \
  rayanlebg/mon-api:latest

# 3. Vérifier que ça marche
curl http://localhost:3000/api/users

# Vous devez voir une réponse JSON (pas d'erreur)
```

---

## Phase 4: Déployer le Frontend (10 min)

### Sur ta machine locale, dans le dossier `client/`:

```bash
# 1. Builder
npm install
npm run build

# Vérifiez qu'un dossier `dist/` a été créé
ls dist/  # Vous devez voir: index.html, assets/, etc.

# 2. Transférer vers le VPS
scp -r -P 54321 ./dist/* devops@91.134.137.211:/var/www/html/

# Si erreur de permission:
# scp -r -P 54321 ./dist/* devops@91.134.137.211:/home/devops/dist/
# ssh devops@91.134.137.211 -p 54321
# sudo mv /home/devops/dist/* /var/www/html/
# sudo chown -R www-data:www-data /var/www/html
```

---

## Phase 5: Configurer GitHub Secrets (5 min)

### Sur GitHub:

1. Allez sur votre repo → **Settings** → **Secrets and variables** → **Actions**

2. Cliquez sur **"New repository secret"** et créez 3 secrets:

#### Secret 1: SERVER_IP
```
Nom: SERVER_IP
Valeur: 91.134.137.211
```

#### Secret 2: SERVER_USER
```
Nom: SERVER_USER
Valeur: devops
```

#### Secret 3: SSH_PRIVATE_KEY
```
Nom: SSH_PRIVATE_KEY
Valeur: [Contenu de votre clé SSH privée]
```

**Pour obtenir la clé SSH:**
```bash
# Sur votre machine locale
cat ~/.ssh/id_rsa
```

Copiez **tout** le contenu (de BEGIN PRIVATE KEY à END PRIVATE KEY inclus) et collez dans le secret.

---

## 🎯 Tester le Déploiement

### Ouvrez votre navigateur:

```
Frontend: http://91.134.137.211/
API:      http://91.134.137.211:3000/api/users
Swagger:  http://91.134.137.211:3000/api-docs
```

**Tout doit marcher! Si erreur, voir la section Troubleshooting.**

---

## 🔄 Tester GitHub Actions

### Maintenant que les secrets sont configurés:

```bash
# 1. Modifiez un texte visible dans React (ex: un titre)
# Edit any .tsx file in client/src/

# 2. Commit et push
git add .
git commit -m "Test CI/CD pipeline"
git push origin main

# 3. Allez sur GitHub → Actions
# Vous devez voir le workflow s'exécuter

# 4. Rafraîchissez votre navigateur: http://91.134.137.211/
# Vous devez voir votre changement!
```

---

## ⚠️ Important - Points Critiques

1. **Port SSH du VPS = 54321** (pas 22!)
   - Toute commande SSH: `-p 54321`
   - Toute commande SCP: `-P 54321` (majuscule!)

2. **Les Github Secrets DOIVENT être configurés** avant de pusher
   - Sinon le CD (déploiement auto) ne fonctionnera pas

3. **La clé SSH doit avoir les bonnes permissions**:
   ```bash
   chmod 600 ~/.ssh/id_rsa
   ```

---

## 🆘 Troubleshooting Rapide

### L'API ne répond pas

```bash
# Vérifier que le container tourne
sudo docker ps

# Si vide, voir les erreurs
sudo docker logs <container_id>

# Vérifier les ports
sudo netstat -tlnp | grep 3000

# Redémarrer
sudo docker stop <container_id>
sudo docker pull rayanlebg/mon-api:latest
# Relancer avec la commande plus haut
```

### Le frontend n'affiche que "Cannot GET /"

```bash
# Vérifier les fichiers
ssh devops@91.134.137.211 -p 54321
ls -la /var/www/html/

# Vérifier les permissions
sudo chown -R www-data:www-data /var/www/html
sudo chmod -R 755 /var/www/html

# Redémarrer Nginx
sudo systemctl restart nginx
```

### GitHub Actions échouent

1. Vérifier les secrets: Settings → Secrets
2. Vérifier la clé SSH: `cat ~/.ssh/id_rsa`
3. Vérifier les logs: Actions → Workflow → Cliquez sur le job qui échoue

### Impossible de se connecter au VPS

```bash
# Vérifier la clé SSH
ssh -i ~/.ssh/id_rsa devops@91.134.137.211 -p 54321 -v
# Le -v affiche les détails

# Si problème de clé
ssh-keyscan -p 54321 91.134.137.211 >> ~/.ssh/known_hosts
```

---

## 📊 Checklist Finale

- [ ] Phase 1: Migrations Sequelize exécutées
- [ ] Phase 2: Image Docker pushée sur DockerHub
- [ ] Phase 3: Container lancé sur le VPS
- [ ] Phase 4: Frontend déployé
- [ ] Phase 5: GitHub Secrets configurés
- [ ] Frontend accessible: http://91.134.137.211/
- [ ] API accessible: http://91.134.137.211:3000/api/users
- [ ] GitHub Actions test réussi

---

## 🎓 Prochaines Étapes (Bonus)

Une fois tout déployé:
- [ ] Configurer un domaine DNS (EPHEC-TI)
- [ ] Configurer HTTPS/SSL
- [ ] Mettre en place des backups de DB
- [ ] Configurer le monitoring/logs
- [ ] Ajouter des webhooks Discord/Slack

---

**C'est parti! 🚀 Suis les phases une par une!**

Des questions? Vois les guides détaillés:
- `DEPLOYMENT_CONFIG.md` - Toutes les infos
- `QUICK_START.md` - Guide rapide
- `DEPLOYMENT_GUIDE.md` - Guide complet
