# Utiliser l'image de base Node.js version 14
FROM node:22.12.0

# Définir le répertoire de travail dans le conteneur
WORKDIR /usr/src/app

# Copier les fichiers package.json et package-lock.json dans le conteneur
COPY package*.json ./

# Installer les dépendances
RUN npm install

# Copier le reste des fichiers de l'application dans le conteneur
COPY . .

# Exposer le port 3000
EXPOSE 3000

# Commande pour démarrer l'application
CMD ["node", "server.js"]