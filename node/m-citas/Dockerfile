FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install -g mysql

COPY . .

CMD [ "npm","start" ]
