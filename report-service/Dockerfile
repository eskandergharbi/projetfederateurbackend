FROM node:22.12.0

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3008
CMD ["node", "server.js"]