FROM node:16

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy neccessary files
COPY package.json package-lock.json rollup.config.js ./
COPY src ./src
COPY generate ./generate
COPY data ./data
COPY public ./public

# install dependecies
RUN npm install
RUN npm run build
RUN npm run assets

# remove unused data
RUN rm -rf rollup.config.js src data

# run server
CMD ["npm", "run", "serve"]
