FROM node:24-slim

WORKDIR /usr/src/app
COPY . .
RUN npm install

EXPOSE 3030

CMD [ "node", "app.ts" ]
