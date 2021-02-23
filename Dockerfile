FROM node:11-alpine

RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json ./
COPY package-lock.json ./

RUN npm install

COPY public ./public
COPY server.js .

CMD ["npm", "run", "start"]

#FROM nginx
#
#COPY public /usr/share/nginx/html
#
#EXPOSE 80
