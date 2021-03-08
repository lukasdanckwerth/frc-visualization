FROM node:11-alpine

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy neccessary files
COPY package.json ./
COPY package-lock.json ./
COPY public ./public
COPY server.js .

# install dependecies
RUN npm install

# run server
CMD ["npm", "run", "start"]
