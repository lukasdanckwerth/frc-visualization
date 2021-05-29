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

COPY data ./data
COPY utils ./utils
RUN npm run generate:assets
RUN rm -rf ./data
RUN rm -rf ./src

# run server
CMD ["npm", "run", "start"]
