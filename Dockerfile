FROM node:22.17.0-alpine AS base

RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

FROM base AS builder

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build

FROM base AS native

WORKDIR /app

COPY package*.json .
RUN npm ci --omit=dev

RUN npm rebuild better-sqlite3

FROM node:22.17.0-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/dist/server ./server
COPY --from=builder /app/dist/shared ./shared

COPY --from=native /app/node_modules ./node_modules
COPY --from=native /app/package*.json ./

ENV NODE_ENV=production \
    HUSKY=0

EXPOSE 2308

CMD ["npm", "run", "docker"]
