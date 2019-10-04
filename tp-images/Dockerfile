FROM node:alpine

WORKDIR /home/node

COPY app/package.json .

RUN npm install

COPY app .

EXPOSE 3000

CMD [ "npm", "run", "start" ]

