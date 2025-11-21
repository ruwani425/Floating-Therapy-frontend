# Simple single-stage Dockerfile for Vite React App
FROM node:18-alpine

WORKDIR /app

RUN apk add --no-cache curl

COPY package*.json ./

RUN npm ci --only=production=false && npm cache clean --force

COPY . .

ARG VITE_API_URL
ARG VITE_APP_ENV=production

ENV VITE_API_URL=$VITE_API_URL
ENV VITE_APP_ENV=$VITE_APP_ENV
ENV NODE_ENV=production

RUN npm run build

RUN npm install -g serve

RUN echo '{"status":"healthy","timestamp":"'$(date -Iseconds)'"}' > /app/dist/health

EXPOSE 3007

HEALTHCHECK --interval=30s --timeout=3s --start-period=30s --retries=3 \
  CMD curl -f http://localhost:3001/health || exit 1

CMD ["serve", "-s", "dist", "-l", "3007"]

