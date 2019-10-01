# TP - Lancez votre premier container et exécutez des commandes

L'objectif de cet exercice est de vous familiariser avec la commande de base `docker run` et le fonctionnement basique d'un container, avec la première notion réseau de `ports`: comment exposer un service provenant d'un container sur la machine hôte. Ensuite, vous apprendrez les subtilités de la commande `docker exec` pour exécuter des commandes dans votre container.

Ainsi, vous devrez lancer un container contenant un service `serveur web`, et accéder à ce serveur Web directement depuis votre machine.

Pour cette démonstration, nous utiliserons l'image docker [amasselot/zelda:latest](https://hub.docker.com/r/amasselot/zelda).

Cette image contient simplement un serveur web `Nginx` qui expose sur le port 80 (du container) un site Web dédié à Zelda:
![zelda website](./assets/website.png)

Par la suite, vous serez amené à exécuter des commandes à l'intérieur de votre container, pour intéragir avec ce système isolé depuis votre machine.

## Pré-requis:

- `docker` installé

## L'exercice

### Première partie: Lancer le container

- Utiliser la commande `docker run` pour lancer un container, vous pouvez utiliser le paramètre `-p` (ou `--publish`) pour spécifier une connexion entre le port de l'hôte et du container (e.g. -p 80:8080 => port 80 de l'hôte pointe sur le port 8080 du container).
- Pour vérifier que tout fonctionne, le résultat dans votre terminal pour la commande `docker ps` doit ressembler à cela:
  ```bash
  docker ps
  CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                NAMES
  e2fa51b6d935        amasselot/zelda     "nginx -g 'daemon of…"   2 seconds ago       Up 1 second         0.0.0.0:80->80/tcp   silly_engelbart
  ```
- Vous pouvez également ouvrir votre navigateur à l'adresse http://localhost:80, le site présenté en screenshot au dessus devrai s'afficher.

### Seconde partie: Exécuter des commandes dans le container

Vous allez à présent créer une seconde page `html`, servie par le serveur `nginx` qui tourne dans le container (et donc accessible depuis votre navigateur si vous avez suivi la première partie).

**Pour exécuter une commande dans un container, il faut utiliser la commande Docker** `docker exec <container-id ou container-name> <commande>`.

- Exécutez la commande `ls /usr/share/nginx/html` (dossier servi par le serveur web) dans votre container, vous devriez voir la résultat suivant:
  ```bash
  02f4939074890aad26919533e1beb73f.png
  09b923ad8ef09b495bfd06d83c046dd3.png
  19511a3b79e04733be61d3fa0633c517.jpg
  1cd72c9d85698cbd0a71c8d8cecbd6d8.jpg
  22cf8033aef80630301964ab0714b9e9.png
  284d010ffbd1049bab16b364c8bcbb4e.png
  2e68d15ce56e32aa15daca0469d2516d.png
  3db80243a52615690097743fcd213c6c.png
  44bff5420cd05f77e65719a59b2a02a8.png
  4eadaacfa9a92232ce6399d6a8df4dc2.jpg
  50x.html
  57791017495a68cc0596f480481b7b4d.ttf
  62137a998d754061ba24ed47ea5edda8.ttf
  65caef5b7e95c66b21a18f6e96903577.ttf
  71de3ab19593ddcbaace28044de1b70a.png
  749678d1a8809f8b1cb519c36eda18ec.png
  7892012b7de113463dbf9dd319a1dd1f.jpg
  9a8cf4fa609149d8255aeafce589a894.png
  ad347bb1d634e032a1135a4de82f26e8.jpg
  af1a5ab7a798baa7ad08fa93e85b9e47.png
  app.7e341b306b9adb709011.js
  c147b55b6ac59c96d3e8438e7150a5e5.png
  index.html
  styles.css
  ```
  Vous venez d'exécuter une commande permettant de `lister les fichiers du dossier /usr/share/nginx/html` dans votre container.
- Maintenant, vous allez ouvrir une session `terminal` dans votre container, vous permettant d'accéder au système du container et de pouvoir lancer plusieurs commandes à la suite, jusqu'à ce que vous fermiez cette session:
  - La commande `docker exec -it` permet d'activer un mode `intéractif (-i) dans votre propre terminal (-t)`
  - L'image `amasselot/zelda` est basé sur `Linux: Ubuntu`, il faut donc utiliser la commande `bash` pour initialiser une session dans votre terminal.
  - Vous devriez avoir accès au système de fichier du container:
  ```bash
  root@beaa79737682:/#
  # Notez que beaa79737682 est un ID unique, associé au container de façon automatique, vous aurez donc un autre nom dans votre session.
  ```
- Une fois la session initialisée, vous allez créer une nouvelle page HTML à l'intérieur du container:
  ```bash
  # Ajoute la chaine de caractère '<h1>Hello from ....' dans un nouveau fichier situé à /usr/share/nginx/html/test.html
  echo '<h1>Hello from new page</h1>' > /usr/share/nginx/html/test.html
  ```
- Pour vérifier que votre commande a été effectuée avec succès, ouvez votre navigateur à l'adresse http://localhost:80/test.html, le text `Hello from new page` devrait s'afficher.
- Pour quitter la session terminale ouverte dans votre container, utilisez simplement la commande `exit`.
- Pour supprimer le container, vous pouvez utiliser la commande `docker rm <container-id>` avec le container-id récupéré dans la commande `docker ps`.

Dans cette partie, vous avez appris à exécuter des commandes dans votre container:
- commandes simples avec l'utilisation de `docker exec`
- à travers une session ouverte avec votre container grâce aux paramètres `-it` (ou `-i -t`). Cette méthode est très importante dans certains contexte comme par exemple pour débugger une application, l'accès réseau, le stockage ou les permissions à l'intérieur d'un container).