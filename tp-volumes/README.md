# TP - Gérer la donnée avec les volumes & mountpoints

Comme nous avons pu le voir précédemment, un container est `éphémère`, ce qui veut dire que la donnée générée pendant l'exécution d'un container est supprimée lors de la suppression du container.

Or il peut être intéressant de persister cette donnée en local, comme par exemple dans les cas suivants:
- on utilise un service de base de donnée MySQL dans un container, les enregistrements sauvegardés pendant l'exécution du container doivent être conservés en cas de redémarrage/suppression du container.
- On possède une application permettant de générer des fichiers PDF à partir d'enregistrements d'une base de donnée. Cette application tourne dans un container et est exécutée périodiquement (tous les jours à midi par exemple), on souhaite sauvegarder les PDF générés à la fin de l'exécution de l'application.

Il existe deux mécaniques pour intéragir avec le stockage et le système de fichier d'un container qu'on appelle `volumes`, et qui fait référence:
- à un `docker volume`: On délègue la gestion de ce dossier à Docker, on lui demande simplement `crée-moi un volume qui s'appelle mydata, et monte le dans le container à l'emplacement /data`:
  ```bash
  docker volume create mydata
  # On spécifie qu'on veut utiliser le volume mydata, et le monter à l'emplacement /data dans le container
  # le paramètre --rm indique que le container sera supprimé à la fin de l'exécution de la commande "touch ..."
  # Ici, on crée un fichier "volumefile" dans le dossier monté (docker volume)
  docker run --rm -v mydata:/data amasselot/zelda touch /data/volumefile
  # On relance un nouveau container, en utilisant le même volume mydata dans lequel nous avons écrit précédemment, et lisons le contenu du fichier test.txt
  docker run --rm -v mydata:/data amasselot/zelda ls /data
  ```
  Lorsque le container est supprimé, le volume existe toujours en local (sur votre machine), vous pouvez utiliser ce volume à nouveau dans un autre container. La commande précédente devrait donc afficher le résultat suivant (lister les fichiers dans le dossier /data, qui est le volume docker):
  ```bash
  volumefile
  ```
- à un `mountpoint`: On monte un `volume local` (dossier/fichier présent sur votre ordinateur) dans le container. Ainsi, lorsqu'un fichier monté dans le container est modifié (dans le container ou en local), il l'est des deux côtés:
  ```bash
  # On créer un dossier `mydata` en local
  mkdir mydata
  # Pour spéficier que l'on souhaite monter un volume local, on doit utiliser le chemin absolu vers ce fichier, d'où l'utilisation de la commande `pwd`
  docker run --rm -v $(pwd)/mydata:/data amasselot/zelda touch /data/mountpoint
  # En listant les fichiers dans un container en montant le même volume local
  docker run --rm -v $(pwd)/mydata:/data amasselot/zelda ls /data
  # Et: En listant les fichiers en local
  ls mydata
  ```
  Cette méthode est souvent la plus utilisée, puisqu'on a le contrôle total de nos données (`docker volume` le gère pour nous).

À Travers ce TP, vous vous familiariserez avec l'utilisation de ces deux méthodes.

## L'Exercice

## Partie 1: Persister de la donnée avec les volumes

[Le script node.js](./index.js) utilisé dans cet exemple va simplement créer un nouveau fichier dans le file system avec un nom généré aléatoirement à l'emplacement `/data/<généré aléatoirement>`.

Vous allez donc devoir:
- Créer un docker volume pour ce TP
- Monter [le script en question](./index.js) dans un container (`node:alpine` avec node.js installé).
- Monter le volume créer pour ce TP dans le container à l'emplacement `/data`
- Exécuter le script node dans le container (à plusieurs reprises), permettant ainsi de généré un fichier dans le volume docker.
- Lister le contenu du volume monté, pour vous assurer que les fichiers ont été persistés entre chaque exécution.

### Les étapes à réaliser:

- Placez vous (`cd` dans votre terminal) dans le dossier contenant ce TP (que vous avez `git clone` en local).
- Créez un nouveau volume appelé `tp-volume` (`docker volume`)
- Lancez un container `node:alpine`, montez [le fichier index.js](./index.js) à l'emplacement `/home/app/index.js`. Avec la commande `ls /home/app`, si vous montez le script correctement, vous devriez voir le résultat suivant:
  ```bash
  # docker run -v .... node:alpine ls /home/app
  index.js # -> Le script monté dans le container
  ```
- Complétez votre commande (`docker run -v ... node:alpine`): montez le volume créer précédemment (`tp-volume`) à l'emplacement `/data` dans le container et exécutez la commande: `ls /`. Si votre commande est correcte, vous devriez voir le résultat suivant:
  ```bash
  # docker run -v ... node:alpine ls /
  bin
  data # -> Votre docker volume
  dev
  etc
  home
  lib
  media
  mnt
  opt
  proc
  root
  run
  sbin
  srv
  sys
  tmp
  usr
  var
  ```
- Vous pouvez maintenant compléter votre commande: Exécutez la commande `node /home/app/index.js` (au lieu de `ls /`). Cela vous permettra d'exécuter le fichier `index.js` monté depuis votre ordinateur, pour générer un fichier dans le `docker volume`, crée et monté précédemment.
  ```bash
  # docker run -v ... node:alpine node /home/app/index.js
  # ici "lxjd7a4780s75qpjpic5ff" est un nom généré aléatoirement, vous aurez donc un nom différent
  File generated properly at /data/lxjd7a4780s75qpjpic5ff
  ```
  Si votre commande est incorrecte, vous pourriez obtenir une erreur comme par exemple:
  ```bash
    [Error: ENOENT: no such file or directory, open '/data/yb74xeu3lbrl7fadcddak'] {
    errno: -2,
    code: 'ENOENT',
    syscall: 'open',
    path: '/data/yb74xeu3lbrl7fadcddak'
  }
  ```
- Ré-exécutez la commande plusieurs fois, pour générer plusieurs fichiers dans votre volume.
- Maintenant, nous allons vérifier que la donnée est réellement persistante entre chaque exécution des nouveaux containers: Modifiez la commande pour exécuter `ls /data` dans le container:
  ```bash
  # docker run ... node:alpine ls /data
  3s7rl9n1cmp0u1irry04iy
  8i64wql8uxamqe46hdm30m
  lxjd7a4780s75qpjpic5ff
  pvscg21r0g2e7z4czud4a
  pythemz2v7ol1i7iwhsrm
  # Les noms des fichiers ci-dessus sont générés de façon aléatoire, vous n'aurez donc pas le même résultat, il faut juste que des fichiers apparaissent
  ```
  Dans le cas où le résultat est vide, la donnée n'est pas persistante entre chaque exécution, vous avez fait une erreur quelque part, je vous invite donc à reprendre l'exercice.

Vous pouvez supprimer le volume crée pour cet exercice avec la commande:
```bash
docker volume rm tp-volume
```

## Partie 2: 

Dans cette partie, nous allons utiliser l'image `nginx:alpine` (serveur Web) pour développer en local un site avec des fichier `HTML` (vous pourrez par la suite appliquer cette technique pour développer en PHP, ou Node.js par exemple sans avoir installé ces technologies sur votre ordinateur).

Nous allons utiliser principalement [le sous-dossier tp-volumes-web](./tp-volumes-web) et par conséquent [le fichier index.html](./tp-volumes-web/index.html) pour compléter ce TP.

- À l'aide de votre éditeur préféré: ouvrez le dossier contenant ce TP à l'aide de votre éditeur préféré (vous pouvez également réaliser le TP avec vim, emacs ... depuis votre terminal).
- Lancez un container `nginx:alpine` en montant [le dossier tp-volumes-web](./tp-volumes-web) à l'emplacement `/usr/share/nginx/html`, prenez soin de mapper le port 80 de votre machine au port 80 du container avec l'option `-p <local-port>:<container-port>`.
- Pour vérifier que tout fonctionne comme prévu, ouvrez votre navigateur à l'adresse http://localhost:80, vous devriez voir le contenu [du fichier index.html](./tp-volumes-web/index.html).
- Vous pouvez dès à présent modifier le contenu du fichier (Par exemple: `Hello, a été modifé`), et sauvegardez le fichier en local.
- Rechargez la page de votre navigateur, vous devriez à présent voir le contenu modifié: Le `mountpoint` entre votre dossier local `tp-volumes-web` (et son contenu: index.html) et le dossier `/usr/share/nginx/html` dans votre container fonctionne correctement.
- Arrêtez le container, modifiez [le fichier index.html](./tp-volumes-web/index.html) à nouveau, puis relancez la commande `docker run -p ... -v ... nginx:alpine`, ouvrez votre navigateur http://localhost:80, le contenu affiché doit être le même que celui de votre fichier index.html.

À présent, vous devez être en mesure d'utiliser des `mountpoints` et `docker volumes` pour intéragir avec le système de fichier d'un container, et surtout pour `persiter de la donnée en local`.


### Bonus

Avec l'image [mongo:3.2](https://hub.docker.com/_/mongo) (Référez vous à la documentation pour la partie stockage):
- Utiliser un volume (local ou docker volume, à votre convenance) pour persister les données de la base mongo
- Lancez le container mongo (en prenant soin de monter le volume au bon emplacement dans le container)
- Dans un autre terminal (ou dans le même si vous avez utilisé le flag `-d`): entrez dans le shell mongo avec la commande:
  ```bash
  docker exec -it <container-id> mongo
  ```
- Créez des données dans le container:
  ```bash
  # Dans le container
  use local # utiliser la base mongo par défaut: local
  # Créer une nouvelle collection
  db.createCollection('dogs')
  # Insérez un nouveau document
  db.dogs.insert({ name: 'hello' })
  # Assurez vous que le document a bien été crée
  db.dogs.find()
  # { "_id" : ObjectId("5d9457dc28f8e81ba1d92d53"), "name" : "hello" }
  ```
- Supprimez le container, puis `docker run` à nouveau (avec la même commande que précédemment)
- Entrez à nouveau dans le container (Shell mongo):
  ```bash
  docker exec -it <container-id> mongo
  ```
- Assurez vous que la donnée est toujours présente, puisque montée au bon endroit (et donc persistante sur votre machine à chaque exécution de container):
  ```bash
  # utiliser la base local
  use local
  # Lister les données
  db.dogs.find()
  # { "_id" : ObjectId("5d9457dc28f8e81ba1d92d53"), "name" : "hello" }
  ```
