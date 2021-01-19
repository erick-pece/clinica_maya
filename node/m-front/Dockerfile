FROM node:alpine

WORKDIR /app

COPY package*.json ./

RUN npm install
RUN npm install axios cors express nodemon

COPY . .

CMD [ "npm","start" ]



