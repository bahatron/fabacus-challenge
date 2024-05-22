FROM node:lts-slim

RUN npm i -g pm2

WORKDIR /app
COPY ./package*.json ./
RUN npm ci
COPY . .
RUN npm run build:clean