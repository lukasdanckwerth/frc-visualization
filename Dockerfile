FROM node:18-alpine

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy neccessary files
COPY . ./

# install dependecies
RUN yarn install
RUN yarn run build

RUN rm -rf node_modules

RUN yarn install --production
# RUN npm run assets

# remove unused data
RUN rm -rf rollup.config.js src generate 

# run server
CMD ["yarn", "run", "serve"]
