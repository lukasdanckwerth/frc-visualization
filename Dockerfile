FROM node:13

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy neccessary files
COPY package.json ./
COPY package-lock.json ./
COPY public ./public

# install dependecies
RUN npm install

# run server
CMD ["npm", "run", "serve"]
