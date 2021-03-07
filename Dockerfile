FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./
COPY public ./public
COPY server.js .

RUN npm install

CMD ["npm", "run", "start"]
