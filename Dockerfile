FROM node:alpine

RUN mkdir -p /usr/src/node-api
WORKDIR /usr/src/node-api

RUN apk update && apk upgrade

# copy project and install packages
COPY . /usr/src/node-api/
RUN npm install

# open port 3000
EXPOSE 3000

# initialize API
CMD [ "npm","run", "start:dev" ]
