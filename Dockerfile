FROM node:18-alpine

EXPOSE 8080

# create working directory
RUN mkdir -p /usr/src/app

# change into working directory
WORKDIR /usr/src/app

# copy neccessary files
COPY . ./

# install dependecies
RUN yarn install
RUN yarn run build
RUN yarn run assets:about
# RUN yarn run assets:datasets:artists:activity:range
# RUN yarn run assets:count:innovation:list

RUN ls -la data
RUN ls -la scripts

RUN rm -rf node_modules

RUN yarn install --production
# RUN npm run assets

# remove unused data
RUN rm -rf rollup.config.js src scripts

# run server
CMD ["yarn", "run", "serve"]
