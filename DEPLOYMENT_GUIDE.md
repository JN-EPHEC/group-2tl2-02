# 📋 Guide Complet de Déploiement - TP 05 Déploiement

Suivez ce guide étape par étape pour déployer votre application sur le VPS Debian.

## 📝 Information à remplacer

Remplacez les valeurs suivantes partout dans ce guide :

```
YOUR_VPS_IP = 91.134.137.211
YOUR_VPS_USER = devops
YOUR_VPS_PORT = 54321
YOUR_DOCKERHUB_USER = rayanlebg
YOUR_SUPABASE_PASSWORD = X3IRAYHAMIDE2006@
YOUR_SUPABASE_HOST = db.zdgcijmaxrtudrvdrvku.supabase.co
```

---

## ✅ Prérequis

- [x] Accès SSH au VPS Debian
- [x] Docker installé sur le VPS
- [x] Nginx installé sur le VPS
- [x] Compte DockerHub créé
- [x] Compte Supabase créé
- [x] Git configuré localement
- [x] Clé SSH publique ajoutée au VPS (optionnel mais recommandé)

---

## 🚀 Étape 1 : Préparation du serveur distant

### 1.1 Connexion au VPS

```bash
ssh devops@91.134.137.211 -p 54321
```

Ou avec mot de passe si vous n'avez pas de clé SSH :
```bash
# Vous serez invité à entrer le mot de passe
ssh devops@91.134.137.211 -p 54321
```

### 1.2 Mise à jour du système et installation des outils

Une fois connecté au VPS :

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install docker.io nginx -y
```

Vérifiez que les services sont actifs :

```bash
sudo systemctl status docker
sudo systemctl status nginx
```

Si ce n'est pas actif, lancez-les :
```bash
sudo systemctl start docker
sudo systemctl start nginx
```

### 1.3 (Optionnel) Ajouter votre utilisateur au groupe docker

Pour éviter d'utiliser `sudo` à chaque commande docker :

```bash
sudo usermod -aG docker devops
```

Reconnectez-vous pour que le changement prenne effet.

---

## 🗄️ Étape 2 : Préparation de la base de données Supabase

### 2.1 Créer un projet Supabase

1. Allez sur [https://supabase.com](https://supabase.com)
2. Connectez-vous avec GitHub
3. Cliquez sur "New project"
4. Remplissez les infos :
   - **Organization** : Sélectionnez votre org
   - **Database Name** : Donnez un nom (ex: `mon-api-db`)
   - **Database Password** : Créez un mot de passe sécurisé (sauvegardez-le!)
   - **Region** : Choisissez la région la plus proche (ex: Frankfurt ou Paris)

5. Cliquez sur "Create new project" et attendez que la DB soit prête

### 2.2 Récupérer la connexion Supabase

1. Une fois le projet créé, allez dans "Project Overview"
2. Cherchez "Connection string" sous le nom de la DB
3. Cliquez dessus pour voir les options (Direct Connection String)
4. Copiez la chaîne, elle ressemble à :
```
postgresql://postgres.xxxxxxxxx:YOUR_SUPABASE_PASSWORD@aws-0-eu-central-1.pooler.supabase.com:6543/postgres
```

**Remplacez** `[MOT_DE_PASSE]` par votre mot de passe Supabase si nécessaire.

### 2.3 Configuration Sequelize (LOCAL)

Sur votre machine locale, dans le dossier `server/` :

```bash
# Installez sequelize-cli si ce n'est pas fait
npm install --save-dev sequelize-cli

# Initialisez Sequelize
npx sequelize-cli init

# Installez pg (PostgreSQL driver)
npm i pg pg-hstore
```

### 2.4 Configurer la migration Sequelize

Allez dans le fichier `server/config/config.json` et remplacez par :

```json
{
  "development": {
    "username": "postgres",
    "password": "YOUR_LOCAL_DB_PASSWORD",
    "database": "postgres",
    "host": "localhost",
    "port": 5432,
    "dialect": "postgres"
  },
  "production": {
    "username": "postgres",
    "password": "YOUR_SUPABASE_PASSWORD",
    "database": "postgres",
    "host": "YOUR_SUPABASE_HOST.supabase.co",
    "port": 5432,
    "dialect": "postgres",
    "dialectOptions": {
      "ssl": {
        "require": true,
        "rejectUnauthorized": false
      }
    }
  }
}
```

### 2.5 Lancer les migrations

Sur votre machine locale (dans le dossier `server/`) :

```bash
NODE_ENV=production npx sequelize-cli db:migrate
```

Vérifiez dans le Supabase Dashboard (Table Editor) que vos tables ont bien été créées.

---

## 🐳 Étape 3 : Déploiement du Backend via Docker

### 3.1 Construire et pousser l'image Docker

Sur votre machine locale, dans le dossier `server/` :

```bash
# Construisez l'image Docker
docker build -t rayanlebg/mon-api:latest .

# Connectez-vous à DockerHub
docker login
# Entrez:
# Pseudo: rayanlebg
# Mot de passe: Avril2006@

# Poussez l'image
docker push rayanlebg/mon-api:latest
```

### 3.2 Lancer le conteneur sur le VPS

Retournez sur le terminal du VPS :

```bash
# Récupérez l'image depuis DockerHub
sudo docker pull rayanlebg/mon-api:latest

# Lancez le conteneur avec les variables d'environnement
sudo docker run -d -p 3000:3000 \
  -e NODE_ENV=production \
  -e DATABASE_URL="postgresql://postgres:X3IRAYHAMIDE2006@db.zdgcijmaxrtudrvdrvku.supabase.co:5432/postgres" \
  rayanlebg/mon-api:latest
```

Vérifiez que l'API répond :

```bash
curl http://localhost:3000/api/users
```

Ou depuis votre machine :
```
http://91.134.137.211:3000/api/users
```

### 3.3 Vérifier le firewall (optionnel)

Si l'API n'est pas accessible, vérifiez le firewall du VPS :

```bash
sudo ufw status
```

Si actif, ouvrez le port 3000 :

```bash
sudo ufw allow 3000/tcp
sudo ufw allow 3000/udp
```

---

## 🎨 Étape 4 : Déploiement du Frontend React

### 4.1 Configurer les variables d'environnement

Sur votre machine locale, mettez à jour le fichier `client/.env.production` :

```env
VITE_API_URL=http://91.134.137.211:3000/api
```

### 4.2 Builder l'application

Dans le dossier `client/` sur votre machine :

```bash
npm install
npm run build
```

Cela génère un dossier `dist/` avec votre application compilée.

### 4.3 Transférer les fichiers vers le VPS (SCP)

Toujours dans le dossier `client/` :

```bash
scp -r -P 54321 ./dist/* devops@91.134.137.211:/var/www/html/
```

Si vous avez une erreur de permission :

```bash
# D'abord, transférez vers le dossier home
scp -r -P 54321 ./dist/* devops@91.134.137.211:/home/devops/dist/

# Puis sur le VPS, déplacez les fichiers
ssh devops@91.134.137.211 -p 54321
sudo mv /home/devops/dist/* /var/www/html/
sudo chown -R www-data:www-data /var/www/html
```

### 4.4 Vérifier que le frontend fonctionne

Ouvrez votre navigateur et allez à :
```
http://91.134.137.211/
```

---

## 🔄 Étape 5 : Configuration GitHub Actions (CI/CD)

### 5.1 Créer les secrets GitHub

1. Allez sur votre dépôt GitHub
2. Cliquez sur **Settings** > **Secrets and variables** > **Actions**
3. Créez les secrets suivants :

| Nom | Valeur |
|-----|--------|
| `SERVER_IP` | `91.134.137.211` |
| `SERVER_USER` | `devops` |
| `SSH_PRIVATE_KEY` | Contenu de votre clé SSH privée (~/.ssh/id_rsa) |

**Comment obtenir votre clé SSH privée ?**

Sur votre machine locale :
```bash
# Affiche le contenu de votre clé SSH privée
cat ~/.ssh/id_rsa
```

Copiez tout (y compris les lignes BEGIN et END) et collez dans le secret `SSH_PRIVATE_KEY`.

### 5.2 Vérifier les workflows

Les fichiers suivants doivent exister dans votre dépôt :

- `.github/workflows/ci.yml` - Lance les tests à chaque push
- `.github/workflows/cd-frontend.yml` - Déploie le frontend sur la branche main

### 5.3 Tester les workflows

1. **Testez le CI (tests)** :
   - Faites un commit et un push
   - Allez dans l'onglet **Actions** de votre repo GitHub
   - Vous devriez voir le workflow `Continuous Integration - Tests` s'exécuter

2. **Testez le CD (déploiement)** :
   - Modifiez un texte visible dans votre frontend (ex: un titre)
   - Faites un commit et un push sur la branche `main`
   - Allez dans l'onglet **Actions** et attendez que le workflow se termine
   - Rafraîchissez votre navigateur à `http://YOUR_VPS_IP/`
   - Vous devriez voir la modification !

---

## 🧪 Commandes Utiles

### Vérifier les conteneurs Docker en cours

```bash
sudo docker ps
```

### Voir les logs d'un conteneur

```bash
sudo docker logs <container_id>
```

### Arrêter un conteneur

```bash
sudo docker stop <container_id>
```

### Supprimer un conteneur

```bash
sudo docker rm <container_id>
```

### Tester l'API de déploiement

```bash
# Sur le VPS ou depuis votre machine
curl -X GET http://YOUR_VPS_IP:3000/api/users
```

### Redémarrer Nginx

```bash
sudo systemctl restart nginx
```

---

## 🔐 Sécurité - Points Importants

⚠️ **JAMAIS** :
- Ne commettez pas vos mots de passe ou clés dans le code source
- Ne mettez pas les fichiers `.env` sur GitHub
- Ne partagez pas votre clé SSH privée

✅ **À FAIRE** :
- Utilisez les GitHub Secrets pour les données sensibles
- Utilisez les variables d'environnement sur le VPS
- Gardez vos mots de passe Supabase sécurisés
- Utilisez SSH avec clés plutôt qu'avec mots de passe

---

## 📞 Troubleshooting

### L'API ne répond pas

```bash
# Vérifiez que le conteneur tourne
sudo docker ps

# Vérifiez les logs
sudo docker logs <container_id>

# Vérifiez la connexion à la DB
# Les logs doivent afficher: "✅ Base de données PostgreSQL synchronisée"
```

### Le frontend ne charge pas l'API

- Vérifiez que `VITE_API_URL` dans `.env.production` pointe vers le bon IP
- Vérifiez que le port 3000 est accessible
- Vérifiez le firewall du VPS

### Les fichiers ne se transferent pas via SCP

```bash
# Vérifiez que le dossier /var/www/html/ existe
ssh YOUR_VPS_USER@YOUR_VPS_IP ls -la /var/www/html/

# Créez-le s'il n'existe pas
ssh YOUR_VPS_USER@YOUR_VPS_IP sudo mkdir -p /var/www/html
```

---

## ✨ Résumé des fichiers modifiés/créés

- ✅ `server/config/config.json` - Configuration Sequelize
- ✅ `server/.env.example` - Exemple des variables d'environnement
- ✅ `server/src/config/database.ts` - Mis à jour pour utiliser les env vars
- ✅ `client/.env.development` - Variables de développement
- ✅ `client/.env.production` - Variables de production
- ✅ `.github/workflows/ci.yml` - Workflow CI (tests)
- ✅ `.github/workflows/cd-frontend.yml` - Workflow CD (déploiement frontend)

---

**Bon déploiement! 🚀**
