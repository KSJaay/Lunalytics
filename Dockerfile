FROM node:22.22.1-alpine AS base

RUN apk add --no-cache \
    python3 \
    make \
    g++

WORKDIR /app

FROM base AS builder

COPY package*.json .
RUN npm ci

COPY . .
RUN npm run build && \
    find dist \( -name "*.map" -o -name "*.d.ts" -o -name "*.d.ts.map" -o -name "*.tsbuildinfo" \) -delete

FROM base AS native

WORKDIR /app

COPY package*.json .
RUN npm ci --omit=dev && \
    npm rebuild better-sqlite3 && \
    find node_modules \( \
      -name "*.md" -o -name "CHANGELOG*" -o -name "LICENSE*" -o -name "AUTHORS*" \
      -o -name ".npmignore" -o -name ".travis.yml" -o -name ".eslintrc*" \
      -o -name "*.d.ts" -o -name "*.d.ts.map" -o -name "*.map" \
      -o -name "tsconfig.json" -o -name ".package-lock.json" \
    \) -delete 2>/dev/null; \
    find node_modules -type d \( \
      -name "test" -o -name "tests" -o -name "__tests__" \
      -o -name "docs" -o -name "doc" -o -name "example" -o -name "examples" \
      -o -name ".github" -o -name "man" \
    \) -exec rm -rf {} + 2>/dev/null; \
    rm -rf node_modules/.cache node_modules/.package-lock.json 2>/dev/null; \
    true

FROM node:22.22.1-alpine AS production

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/scripts ./scripts
COPY --from=native /app/node_modules ./node_modules
COPY --from=native /app/package*.json ./

RUN ln -s dist/server server && ln -s dist/shared shared

ENV NODE_ENV=production \
    HUSKY=0

EXPOSE 2308

CMD ["sh", "-c", "node scripts/setup.js && node dist/server/index.js"]
