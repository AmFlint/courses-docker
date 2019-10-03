# TP - Docker compose Production

Ce TP servira à valider vos connaissances sur l'ensemble de Docker (vu jusqu'ici) à savoir:
- Run des containers et les configurer
- volume
- network
- images (Dockerfile)
- Docker-compose

Les différents composants de l'exercice:
- Container Base de donnée MySQL
- Container Phpmyadmin pour administrer la base MySQL
- Container node contenant une API express (la même que pour le tp [docker compose dev](../tp-compose-dev)), qui va se connecter à la base MySQL grâce à des variables d'environnements, pour afficher une liste messages enregistrés en base.
- Container `nginx` contenant le front (React), connecté à l'API back-end pour afficher la liste de messages (récupérés en base, par le back-end).

Dans cet exercice, vous allez être amené à:
- Développer des fichiers `Dockerfile` pour l'API backend (node), et le front-end (React) qu'il va falloir servir derrière un serveur `nginx`.
- Configurer l'environnement à l'aide de docker-compose


Utiliser la commande `build` dans votre fichier docker-compose.yml pour préciser un chemin vers un Dockerfile à construire:
```yml
version: "3"
services:
  myservice:
    # Lorsqu'on utilise build, l'image ici sera le nom de l'image créer lors du build (comme pour docker build -t <mon-image>)
    image: monimage
    # build le Dockerfile présent dans ./app
    build: ./app
    # ...
```

**Pour rappel: les applications front-end dépendantes d'une phase de `build` (Webpack, gulp...) comme celle utilisée dans cet exercice nécessite deux `stages` pour le build**:
- `node`: Installation des dépendances NPM, `npm run build` (ou équivalent) pour construire les fichiers statiques du site
- `nginx` (ou autre serveur web) pour servir le contenu statique (buildés dans l'étape précédente).

**Attention, la partie `client` (front) utilise une variable d'environnement pour spécifier l'hôte du backend, il s'agit de `REACT_APP_BACKEND_URL`, doit être spécifiée lorsqu'on va exécuter le container**

Pour cet exercice, je vous invite à ré-utiliser le fichier `docker-compose.yml` produit lors du précédent [TP sur docker-compose dev](../tp-compose-dev), puisque la configuration de MySQL et phpmyadmin reste la même (ou va changer très peu).

Vous avez vu au cours du [TP sur les images](../tp-images) comment build:
- 1 image pour une API back-end node.js
- 1 image nécessitant plusieurs stages de build (zelda).

## Les consignes

### MySQL

- Le serveur MySQL ne doit pas être accessible depuis l'hôte (seulement à travers l'API back-end, et phpmyadmin)
- Les données générées par le container MySQL doivent être persistées en local.

### Phpmyadmin

- Phpmyadmin doit être disponible sur le port `8080` de la machine
- Phpmyadmin doit être connecté/authentifié au container MySQL.

### API Back-End

- L'API Back-end ne doit pas être accessible depuis la machine hôte
- L'API Back-end doit être connectée au container MySQL, **Mais pas au container phpmyadmin**.
- L'API Back-End doit être configuré pour requêter la Base de données via les variables d'environnements suivant:
  - `DB_HOST`: hôte (nom du container) de MySQL, par défaut sur '127.0.0.1',
  - `DB_USER`: Utilisateur de la base de donnée MySQL, par défaut 'test',
  - `DB_PASSWORD` mot de passe de le base de donnée MySQL, par défaut 'test',
  - `DB_NAME` le nom de la base à utiliser sur le serveur MySQL, par défaut 'mydatabase'

### Front end

- Le Front-End doit être disponible sur le port 80 de l'hôte
- Le Front-end doit être connecté à l'API backend (mais pas à MySQL et Phpmyadmin)
- Le Front-end doit être configuré pour requêter l'API back-end (à travers la variable d'environnement `REACT_APP_BACKEND_URL`).

## Vérification

Pour vous assurez que l'exercice est réalisé correctement, vous devrez ouvrir votre navigateur sur le `localhost:80` et constater la page suivante:


