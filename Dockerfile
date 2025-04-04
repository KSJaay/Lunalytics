FROM node:22-alpine AS base

WORKDIR /app

FROM base AS builder

WORKDIR /app

COPY . .

# Build application
RUN npm ci --force
RUN npm run build

FROM base AS production

WORKDIR /app

# Copy built application
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/package-lock.json ./package-lock.json
COPY --from=builder /app/scripts ./scripts
COPY --from=builder /app/server ./server
COPY --from=builder /app/shared ./shared

RUN npm install
RUN npm prune --production

EXPOSE 2308 

CMD ["npm", "run", "docker"]