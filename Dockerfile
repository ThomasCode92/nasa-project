FROM node:20-alpine

WORKDIR /app

COPY . .

RUN npm install --omit=dev

RUN npm run build --prefix client

USER node

CMD ["npm", "start", "--prefix", "server"]

EXPOSE 8000
