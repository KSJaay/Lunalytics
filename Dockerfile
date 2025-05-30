ARG BUILDPLATFORM

FROM --platform=$BUILDPLATFORM node:22.14.0-alpine AS base

RUN apk add --no-cache \
    build-base \
    python3 \
    py3-pip \
    make \
    g++

WORKDIR /app

FROM base AS builder

COPY package*.json ./
RUN npm ci

COPY . .

RUN npm run build

FROM node:22.14.0-alpine AS production

RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

ENV HUSKY=0

RUN npm ci --omit=dev

EXPOSE 2308

CMD ["npm", "run", "docker"]