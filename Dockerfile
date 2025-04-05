FROM node:22.14.0-alpine AS base

RUN apk add --no-cache --update \
        build-base=0.5-r3 \
        python3=3.12.9-r0 \
        py3-pip=24.3.1-r0 \
        make=4.4.1-r2 \
        g++=14.2.0-r4 

WORKDIR /app

FROM base AS builder

WORKDIR /app

COPY . .

# Build application
RUN npm ci
RUN npm run build

FROM base AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

ENV HUSKY=0

RUN apk add --no-cache python3 make g++

RUN npm ci --unsafe-perm --build-from-source --omit=dev
RUN npm rebuild better-sqlite3 --build-from-source
RUN npm prune --production

EXPOSE 2308

CMD ["npm", "run", "docker"]