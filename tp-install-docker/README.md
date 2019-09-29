# TP - Installer Docker

Ce TP va vous servir à installer Docker sur votre ordinateur (en fonction de votre système d'exploitation), puis vous permettre de vérifier que l'installation a été correctement effectuée.

## MacOS

Pour MacOS, deux possibilités:
- Installer docker et docker-compose via [homebrew](https://brew.sh/index_fr) (très utile pour installer des packets sur macOS).
- [Docker For Mac](https://docs.docker.com/docker-for-mac/install/): Souvent l'option la plus populaire, car permet l'administration de docker à travers une interface graphique, et est installé avec `Kubernetes` (pour exécuter des tests et se familiariser avec l'outils en local).

Pour ce TP, nous nous baserons sur [Docker For Mac](https://docs.docker.com/docker-for-mac/install/), car version la plus complète et plus facile à administrer pour débuter.


Pour installer docker sur mac, veuillez suivre les différentes étapes présentées dans [la documentation officielle de Docker For Mac](https://docs.docker.com/docker-for-mac/install/).

Vous pouvez ensuite `Vérifier votre installation` dans la partie plus bas.

## Linux

Pour installer `docker` sur votre machine Linux (Debian, Ubuntu, CentOS, Fedora...), vous allez devoir installer plusieurs packets système.

Vous pouvez vous référer à la documentation officielle pour la partie installation:
- [Installation Ubuntu](https://docs.docker.com/install/linux/docker-ce/ubuntu/)
- [Installation Debian](https://docs.docker.com/install/linux/docker-ce/debian/)
- [Installation Fedora](https://docs.docker.com/install/linux/docker-ce/fedora/)
- [Installation CentOS](https://docs.docker.com/install/linux/docker-ce/centos/)

Une fois l'installation terminée, je vous suggère de suivre les [instructions post-installation](https://docs.docker.com/install/linux/linux-postinstall/).

Par défaut, le client docker appartient au groupe `docker`. Votre utilisateur courant n'aura pas accès au commande `docker ...` (permission denied...) car il ne fait pas encore partie de ce groupe.

Le plus important, sera donc d'ajouter votre `user` au groupe `docker` (sinon vous devrez utiliser la commande `sudo` pour chacune des sous-commandes docker):
```bash
sudo groupadd docker
# Vous pouvez changer la commande export ici pour manuellement inscrire le nom de l'utilisateur à ajouter au groupe docker, ici, l'utilisateur courant sera utilisé
export USER=$(whoami)
sudo usermod -aG docker $USER
```

Pour que le changement soit effectif, vous devrez ouvrir une nouvelle fenêtre (session) terminal, où vos permissions seront ré-évaluées.

Vous pouvez ensuite tester l'installation dans la partie `Vérifier que l'installation fonctionne correctement` plus bas.

## Windows

Pour Windows, il existe plusieurs façons d'installer Docker. Vous choisirez la méthode principalement en fonction de votre version de Windows:
- Si vous possédez `Windows 10 64-bit: Pro, Enterprise, or Education (Build 15063 or later)`: [Docker Desktop](https://docs.docker.com/docker-for-windows/install/).
- Dans le cas contraire, vous devrez installer [Docker Toolbox](https://docs.docker.com/toolbox/toolbox_install_windows/).

**Notez que si vous utilisez l'application Ubuntu for Windows, vous devrez installer Docker sur Windows avant de pouvoir l'utiliser sur Ubuntu**.

**Pré-requis**:
- La fonctionnalité Windows `Hyper-V` (Virtualisation, permet de simuler un nouveau système d'exploitation, sur Windows) doit être active.
- **Pour l'installation de Docker Desktop, pas pour Toolbox**: La fonctionnalité Windows `Containers Windows` doit être active.

Vous pouvez ensuite suivre les instructions de la documentation officielle de la version visée (liens au-dessus).

Vous pouvez ensuite `Vérifier votre installation` dans la partie plus bas.

## Vérifier que l'installation fonctionne correctement

```bash
docker run --rm hello-world
```
Vous devriez voir le résultat le suivant:
```bash
Unable to find image 'hello-world:latest' locally
latest: Pulling from library/hello-world
1b930d010525: Pull complete 
Digest: sha256:b8ba256769a0ac28dd126d584e0a2011cd2877f3f76e093a7ae560f2a5301c00
Status: Downloaded newer image for hello-world:latest

Hello from Docker!
This message shows that your installation appears to be working correctly.

To generate this message, Docker took the following steps:
 1. The Docker client contacted the Docker daemon.
 2. The Docker daemon pulled the "hello-world" image from the Docker Hub.
    (amd64)
 3. The Docker daemon created a new container from that image which runs the
    executable that produces the output you are currently reading.
 4. The Docker daemon streamed that output to the Docker client, which sent it
    to your terminal.

To try something more ambitious, you can run an Ubuntu container with:
 $ docker run -it ubuntu bash

Share images, automate workflows, and more with a free Docker ID:
 https://hub.docker.com/

For more examples and ideas, visit:
 https://docs.docker.com/get-started/
```
