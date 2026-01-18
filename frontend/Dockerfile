FROM node:25-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["entrypoint.sh"]
