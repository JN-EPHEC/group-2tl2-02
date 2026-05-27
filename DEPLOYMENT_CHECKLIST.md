# ✅ Checklist de Préparation au Déploiement

## Avant de commencer le déploiement, vérifiez que:

### 🔧 Configuration Backend

- [ ] Le fichier `server/config/config.json` est créé avec votre config Supabase
- [ ] Le fichier `server/.env.example` existe (pour la documentation)
- [ ] `server/src/config/database.ts` utilise les variables d'environnement
- [ ] La dépendance `pg` est installée: `npm i pg pg-hstore`
- [ ] Le `Dockerfile` existe et compile bien: `docker build -t test .`
- [ ] Vous avez un compte DockerHub et vous pouvez vous connecter: `docker login`

### 🎨 Configuration Frontend

- [ ] Le fichier `client/.env.development` existe avec `VITE_API_URL=http://localhost:3000/api`
- [ ] Le fichier `client/.env.production` existe avec votre IP VPS
- [ ] Votre code utilise le proxy Vite (voir `vite.config.ts`) OU les appels fetch utilisent `import.meta.env.VITE_API_URL`
- [ ] La build fonctionne localement: `npm run build`

### 🚀 GitHub Actions

- [ ] Le dossier `.github/workflows/` existe
- [ ] Le fichier `ci.yml` existe (tests automatiques)
- [ ] Le fichier `cd-frontend.yml` existe (déploiement automatique)
- [ ] Votre repo a les 3 secrets configurés:
  - [ ] `SERVER_IP`
  - [ ] `SERVER_USER`
  - [ ] `SSH_PRIVATE_KEY`

### 🌐 VPS Debian

- [ ] Vous pouvez vous connecter au VPS: `ssh YOUR_USER@YOUR_IP`
- [ ] Docker est installé: `docker --version`
- [ ] Nginx est installé: `nginx -v`
- [ ] Les services sont actifs: `sudo systemctl status docker` et `sudo systemctl status nginx`

### 🗄️ Supabase

- [ ] Vous avez créé un projet Supabase
- [ ] Vous avez la chaîne de connexion
- [ ] Vous avez exécuté les migrations localement: `NODE_ENV=production npx sequelize-cli db:migrate`
- [ ] Les tables existent dans Supabase (vérifiable dans le "Table Editor")

---

## ⚡ Prochaines étapes:

1. **Build et push Docker**:
   ```bash
   docker build -t YOUR_DOCKERHUB_USER/mon-api:latest .
   docker push YOUR_DOCKERHUB_USER/mon-api:latest
   ```

2. **Lancer le conteneur sur le VPS**:
   ```bash
   sudo docker pull YOUR_DOCKERHUB_USER/mon-api:latest
   sudo docker run -d -p 3000:3000 \
     -e NODE_ENV=production \
     -e DATABASE_URL="postgresql://..." \
     YOUR_DOCKERHUB_USER/mon-api:latest
   ```

3. **Builder et déployer le frontend**:
   ```bash
   npm run build
   scp -r ./dist/* YOUR_USER@YOUR_IP:/var/www/html/
   ```

4. **Vérifier**:
   - API: `http://YOUR_IP:3000/api/users`
   - Frontend: `http://YOUR_IP/`

---

## 📖 Lisez aussi:

- `DEPLOYMENT_GUIDE.md` - Guide complet étape par étape
- `server/config/config.json` - Configuration Sequelize
- `.github/workflows/ci.yml` - Tests automatiques
- `.github/workflows/cd-frontend.yml` - Déploiement automatique

Good luck! 🚀
