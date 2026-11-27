# Stage 1: Build TypeScript & Generate Prisma Client
FROM node:24-trixie-slim AS build
WORKDIR /app

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci
RUN npx prisma generate

COPY . .
RUN npm run build

# Stage 2: Final production image
FROM node:24-trixie-slim
WORKDIR /app
ENV NODE_ENV=production

RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/dist ./dist
COPY --from=build /app/uploads/default-avatar.svg ./default-avatar.svg
COPY entrypoint.sh ./entrypoint.sh

RUN mkdir -p /app/uploads/avatars \
    && cp ./default-avatar.svg /app/uploads/default-avatar.svg \
    && chown -R node:node /app/uploads \
    && chmod +x ./entrypoint.sh

EXPOSE 3000
USER node
ENTRYPOINT ["/bin/sh", "./entrypoint.sh"]
