FROM node:v18.20.5

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3009
CMD ["node", "server.js"]