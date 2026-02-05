# TP API Social Network - Sécurisation

Ce projet est une API pour un réseau social développée avec **Node.js** et **Express**, dont l'objectif principal est la mise en œuvre de techniques de sécurité avancées.

## Objectifs de sécurité implémentés

### 1. Authentification & Autorisation
- **JWT (JSON Web Tokens)** : Authentification sans état via des jetons sécurisés.
- **Bcrypt.js** : Hashage des mots de passe (12 rounds) avant stockage en base de données.
- **RBAC (Role-Based Access Control)** : Middleware pour restreindre l'accès à certaines routes selon le rôle (`admin`, `user`).

### 2. Protection contre les attaques communes
- **Helmet** : Sécurisation des en-têtes HTTP (XSS, Clickjacking, CSP, etc.).
- **Rate Limiting** : Protection contre le Brute Force et les attaques DoS (limite à 100 requêtes par 15 min par IP).
- **Injections NoSQL** : Utilisation de `express-mongo-sanitize` pour nettoyer les entrées utilisateur.
- **Data Sanitization** : Limitation de la taille des données entrantes (`limit: '10kb'`).

### 3. Validation des données
- **Joi** : Schémas de validation stricts pour toutes les entrées (Inscription, Connexion, Groupes).

### 4. Gestion des erreurs & Audit
- **Morgan** : Logging des requêtes en mode développement pour l'audit.
- **Global Error Handling** : Middleware centralisé pour capturer les erreurs sans divulguer d'informations sensibles sur le serveur.

## Installation

1. Installer les dépendances : `npm install`
2. Configurer le fichier `.env`
3. Générer le certificat SSL pour HTTPS :
   `openssl req -nodes -new -x509 -keyout key.pem -out cert.pem -subj "/CN=localhost"`
4. Lancer le serveur : `npm run dev`

## Endpoints principaux (HTTPS)

*Note : Utilisez `-k` avec curl pour ignorer les avertissements du certificat auto-signé.*

## Postman

1. Importer la collection :
   - Dans Postman : `Import` → sélectionner le fichier `TP_API1.postman_collection.json`
2. Configurer l'environnement :
   - Créer un Environment (ex: `TP_API1 (local)`) et définir :
     - `baseURL` = `https://127.0.0.1:3000/api/v1`
     - `userToken` = (vide)
     - `adminToken` = (vide)
     - `groupId` = (vide)
3. HTTPS (certificat auto-signé) :
   - Postman Settings → désactiver `SSL certificate verification`
4. Workflow de test recommandé :
   - `POST {{baseURL}}/auth/login` (USER) → stocker le token dans `userToken`
   - `POST {{baseURL}}/auth/login` (ADMIN) → stocker le token dans `adminToken`
   - `POST {{baseURL}}/groups` (avec `userToken`) → stocker `groupId`
   - `DELETE {{baseURL}}/groups/{{groupId}}` (avec `userToken`) → attendu `403`
   - `DELETE {{baseURL}}/groups/{{groupId}}` (avec `adminToken`) → attendu `204`

- `POST https://localhost:3000/api/v1/auth/register` : Inscription
- `POST https://localhost:3000/api/v1/auth/login` : Connexion
- `GET https://localhost:3000/api/v1/users/me` : Profil (Protégé JWT)
- `GET https://localhost:3000/api/v1/groups` : Liste des groupes (Protégé JWT)
- `DELETE https://localhost:3000/api/v1/groups/:id` : Suppression (Admin uniquement)

### Fils de Discussion (Threads)
- `POST /api/v1/threads` : Créer un thread (lié à groupe ou event)
- `GET /api/v1/threads/:threadId/messages` : Voir les messages
- `POST /api/v1/threads/:threadId/messages` : Poster un message

### Social (Albums & Photos)
- `POST /api/v1/social` : Créer un album
- `GET /api/v1/social` : Voir les albums
- `POST /api/v1/social/:albumId/photos` : Ajouter une photo
- `POST /api/v1/social/photos/:photoId/comments` : Commenter une photo

### Sondages (Polls)
- `POST /api/v1/polls` : Créer un sondage
- `POST /api/v1/polls/:id/vote` : Voter

### Événements & Billetterie
- `POST /api/v1/events/:id/buy-ticket` : Acheter un billet
- `PATCH /api/v1/events/:id/ticketing` : Gérer la billetterie
- `PATCH /api/v1/events/:id/bonus` : Gérer les bonus

### Administration (Admin Only)
- `GET /api/v1/users` : Liste de tous les utilisateurs
- `GET /api/v1/users/:id` : Détails d'un utilisateur
- `DELETE /api/v1/users/:id` : Supprimer un utilisateur
- `DELETE /api/v1/groups/:id` : Supprimer n'importe quel groupe
- `DELETE /api/v1/events/:id` : Supprimer n'importe quel événement
- `DELETE /api/v1/threads/:id` : Supprimer n'importe quel thread
- `DELETE /api/v1/social/:id` : Supprimer n'importe quel album
- `DELETE /api/v1/polls/:id` : Supprimer n'importe quel sondage
